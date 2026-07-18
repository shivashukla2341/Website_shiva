import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Using edge runtime is optional, but common for webhooks. 
// We are keeping it node for simpler compatibility with stripe sdk.

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // In a real app, you would import Stripe and verify the signature here
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // For this implementation, we will simulate the event payload
    const event = JSON.parse(body);
    const supabase = await createClient();

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;
        
        if (orderId) {
          await supabase
            .from("orders")
            .update({ 
              status: "Processing", 
              payment_status: "Paid",
              transaction_id: paymentIntent.id 
            })
            .eq("id", orderId);
        }
        break;
        
      case "payment_intent.payment_failed":
        const failedIntent = event.data.object;
        const failedOrderId = failedIntent.metadata?.orderId;
        
        if (failedOrderId) {
          await supabase
            .from("orders")
            .update({ 
              status: "Cancelled", 
              payment_status: "Failed",
            })
            .eq("id", failedOrderId);
        }
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
