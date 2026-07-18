// =============================================================================
// NEXCART — STRIPE PAYMENT API
// POST /api/payments/stripe/create-intent — Create PaymentIntent
// POST /api/payments/stripe/webhook — Handle Stripe webhooks
// =============================================================================

import { NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  requireAuthUser,
  withErrorHandling,
  validateBody,
} from "@/lib/api/helpers";
import { z } from "zod";
import { applyRateLimit, rateLimiters } from "@/lib/rate-limit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia" as any,
});

const createIntentSchema = z.object({
  orderId: z.string().uuid(),
  currency: z.string().default("inr"),
});

// ─── Create Payment Intent ────────────────────────────────────────────────────

export async function createStripePaymentIntent(request: NextRequest) {
  return withErrorHandling(async () => {
    const limited = await applyRateLimit(request, rateLimiters.payment);
    if (limited) return limited;

    const { error: authError, user } = await requireAuthUser();
    if (authError) return authError;

    const validation = await validateBody(request, createIntentSchema);
    if ("error" in validation) return validation.error;

    const { data } = validation;
    const supabase = createAdminClient();

    const { data: order } = await supabase
      .from("orders")
      .select("id, total, status, payment_status, user_id")
      .eq("id", data.orderId)
      .eq("user_id", user!.id)
      .single();

    if (!order) return errorResponse("Order not found", 404);
    if (order.payment_status === "paid") return errorResponse("Already paid", 400);

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // paise/cents
      currency: data.currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: order.id,
        userId: user!.id,
      },
    });

    // Store pending payment
    await supabase.from("payments").insert({
      order_id: order.id,
      user_id: user!.id,
      method: "stripe",
      gateway: "stripe",
      gateway_order_id: paymentIntent.id,
      amount: order.total,
      currency: data.currency.toUpperCase(),
      status: "pending",
    });

    return successResponse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  })();
}

// ─── Stripe Webhook Handler ───────────────────────────────────────────────────

export async function handleStripeWebhook(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return errorResponse("Invalid webhook signature", 400);
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata.orderId;
      const userId = pi.metadata.userId;

      // Update payment
      await supabase
        .from("payments")
        .update({
          gateway_payment_id: pi.id,
          status: "paid",
        })
        .eq("gateway_order_id", pi.id);

      // Update order
      const { data: order } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
        })
        .eq("id", orderId)
        .select()
        .single();

      // Tracking
      await supabase.from("order_tracking").insert({
        order_id: orderId,
        status: "confirmed",
        title: "Payment Received",
        description: `Payment of ${pi.currency.toUpperCase()} ${(pi.amount / 100).toFixed(2)} received via Stripe`,
      });

      // Clear cart
      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", userId)
        .single();
      if (cart) {
        await supabase.from("cart_items").delete().eq("cart_id", cart.id);
      }

      // Notification
      await supabase.from("notifications").insert({
        user_id: userId,
        type: "payment_success",
        title: "Payment Successful! 🎉",
        body: `Your order #${order?.order_number} has been confirmed.`,
        action_url: `/orders/${orderId}`,
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orderId = pi.metadata.orderId;

      await supabase
        .from("payments")
        .update({ status: "failed" })
        .eq("gateway_order_id", pi.id);

      await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", orderId);

      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        await supabase
          .from("payments")
          .update({ status: "refunded" })
          .eq("gateway_payment_id", charge.payment_intent as string);
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return successResponse({ received: true });
}
