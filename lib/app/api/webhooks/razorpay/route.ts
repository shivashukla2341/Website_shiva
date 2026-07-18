import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing RAZORPAY_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = await createClient();

    // Handle payment events
    switch (event.event) {
      case "payment.captured":
        // Update order status in Supabase
        const payment = event.payload.payment.entity;
        const orderId = payment.notes?.order_id;

        if (orderId) {
          await supabase
            .from("orders")
            .update({ 
              status: "Processing", 
              payment_status: "Paid",
              transaction_id: payment.id 
            })
            .eq("id", orderId);
        }
        break;
      
      case "payment.failed":
        const failedPayment = event.payload.payment.entity;
        const failedOrderId = failedPayment.notes?.order_id;
        
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
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
