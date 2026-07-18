import { Resend } from "resend";

// Initialize Resend
// We use a dummy key if it's missing so the app doesn't crash during build
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");
const FROM_EMAIL = "NexCart <noreply@nexcart.com>";

export const EmailTemplates = {
  // 1. Order Confirmation
  orderConfirmation: (orderId: string, customerName: string, total: number) => ({
    subject: `Order Confirmation - #${orderId}`,
    html: `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
        <h2>Thank you for your order, ${customerName}!</h2>
        <p>We've received your order <strong>#${orderId}</strong> and are getting it ready to ship.</p>
        <p><strong>Total Amount:</strong> ₹${total.toLocaleString()}</p>
        <a href="https://nexcart.com/account/orders/${orderId}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
          View Order Status
        </a>
      </div>
    `,
  }),

  // 2. Shipping Notification
  orderShipped: (orderId: string, trackingLink: string) => ({
    subject: `Your Order #${orderId} Has Shipped!`,
    html: `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
        <h2>Good news! Your order is on the way.</h2>
        <p>Your order <strong>#${orderId}</strong> has been handed over to our delivery partner.</p>
        <a href="${trackingLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
          Track Package
        </a>
      </div>
    `,
  }),

  // 3. Welcome Email
  welcome: (name: string) => ({
    subject: "Welcome to NexCart!",
    html: `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
        <h2>Welcome to the NexCart family, ${name}!</h2>
        <p>We're thrilled to have you here. Explore thousands of premium products curated just for you.</p>
        <p>Use code <strong>WELCOME500</strong> for ₹500 off your first order!</p>
      </div>
    `,
  }),

  // 4. Password Reset
  passwordReset: (resetLink: string) => ({
    subject: "Reset Your Password",
    html: `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to choose a new one:</p>
        <a href="${resetLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
          Reset Password
        </a>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  }),

  // 5. Order Cancelled
  orderCancelled: (orderId: string, refundAmount: number) => ({
    subject: `Order Cancelled - #${orderId}`,
    html: `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
        <h2>Order Cancellation Confirmed</h2>
        <p>Your order <strong>#${orderId}</strong> has been cancelled successfully.</p>
        ${refundAmount > 0 ? `<p>A refund of ₹${refundAmount.toLocaleString()} has been initiated to your original payment method.</p>` : ''}
      </div>
    `,
  }),

  // 6. Abandoned Cart
  abandonedCart: (checkoutLink: string) => ({
    subject: "You left something behind!",
    html: `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
        <h2>Still thinking about it?</h2>
        <p>We noticed you left some great items in your cart. They're waiting for you!</p>
        <a href="${checkoutLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
          Return to Checkout
        </a>
      </div>
    `,
  }),

  // 7. Review Request
  reviewRequest: (productName: string, reviewLink: string) => ({
    subject: `How are you liking your ${productName}?`,
    html: `
      <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
        <h2>We'd love your feedback!</h2>
        <p>You recently purchased the <strong>${productName}</strong>. Could you take a minute to let us know how it is?</p>
        <a href="${reviewLink}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
          Leave a Review
        </a>
      </div>
    `,
  })
};

export async function sendEmail(to: string, template: { subject: string, html: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Critical email error:", err);
    return { success: false, error: err };
  }
}
