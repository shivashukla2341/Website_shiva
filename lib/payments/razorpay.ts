// =============================================================================
// NEXCART — RAZORPAY PAYMENT API
// POST /api/payments/razorpay/create — Create Razorpay order
// POST /api/payments/razorpay/verify — Verify payment signature
// =============================================================================

import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
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
import { sendOrderConfirmationEmail } from "@/lib/resend/emails";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ─── Schema ───────────────────────────────────────────────────────────────────

const createOrderSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
});

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string().uuid(),
});

// ─── POST /api/payments/razorpay/create ──────────────────────────────────────
export async function POST_CREATE(request: NextRequest) {
  return withErrorHandling(async () => {
    const limited = await applyRateLimit(request, rateLimiters.payment);
    if (limited) return limited;

    const { error: authError, user } = await requireAuthUser();
    if (authError) return authError;

    const validation = await validateBody(request, createOrderSchema);
    if ("error" in validation) return validation.error;

    const { data } = validation;
    const supabase = await createClient();

    // Fetch order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total, status, payment_status, user_id")
      .eq("id", data.orderId)
      .eq("user_id", user!.id)
      .single();

    if (orderError || !order) return errorResponse("Order not found", 404);
    if (order.payment_status === "paid") {
      return errorResponse("Order already paid", 400);
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100), // paise
      currency: "INR",
      receipt: `NC-${order.id.slice(0, 8)}`,
      notes: {
        orderId: order.id,
        userId: user!.id,
      },
    });

    // Store payment record
    await supabase.from("payments").insert({
      order_id: order.id,
      user_id: user!.id,
      method: "razorpay",
      gateway: "razorpay",
      gateway_order_id: razorpayOrder.id,
      amount: order.total,
      currency: "INR",
      status: "pending",
    });

    return successResponse({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  })();
}

// ─── POST /api/payments/razorpay/verify ──────────────────────────────────────
export async function POST_VERIFY(request: NextRequest) {
  return withErrorHandling(async () => {
    const limited = await applyRateLimit(request, rateLimiters.payment);
    if (limited) return limited;

    const { error: authError, user } = await requireAuthUser();
    if (authError) return authError;

    const validation = await validateBody(request, verifySchema);
    if ("error" in validation) return validation.error;

    const { data } = validation;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== data.razorpay_signature) {
      return errorResponse("Invalid payment signature", 400);
    }

    const supabase = await createClient();

    // Update payment
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        gateway_payment_id: data.razorpay_payment_id,
        gateway_signature: data.razorpay_signature,
        status: "paid",
      })
      .eq("gateway_order_id", data.razorpay_order_id);

    if (paymentError) return serverErrorResponse(paymentError);

    // Update order status
    const { data: order } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
      })
      .eq("id", data.orderId)
      .eq("user_id", user!.id)
      .select()
      .single();

    // Add tracking event
    await supabase.from("order_tracking").insert({
      order_id: data.orderId,
      status: "confirmed",
      title: "Payment Received",
      description: `Payment of ₹${order?.total?.toLocaleString("en-IN")} received via Razorpay`,
    });

    // Clear cart
    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user!.id)
      .single();
    if (cart) {
      await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        orderId: data.orderId,
        orderNumber: order?.order_number ?? "",
        userId: user!.id,
        total: order?.total ?? 0,
        items: [],
      });
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    // Create notification
    await supabase.from("notifications").insert({
      user_id: user!.id,
      type: "payment_success",
      title: "Payment Successful! 🎉",
      body: `Your order #${order?.order_number} has been confirmed.`,
      action_url: `/orders/${data.orderId}`,
    });

    return successResponse({
      orderId: data.orderId,
      orderNumber: order?.order_number,
      status: "confirmed",
    });
  })();
}
