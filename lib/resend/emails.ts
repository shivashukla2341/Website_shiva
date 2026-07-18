// =============================================================================
// NEXCART — EMAIL TEMPLATES (Resend)
// =============================================================================

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
const FROM = `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`;

// ─── Order Confirmation ───────────────────────────────────────────────────────

interface OrderConfirmationParams {
  orderId: string;
  orderNumber: string;
  userId: string;
  total: number;
  items: {
    product_name: string;
    quantity: number;
    price: number;
    product_image?: string;
  }[];
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationParams) {
  const { orderNumber, total, items } = params;

  const itemsHtml = items
    .map(
      (item) => `
    <tr style="border-bottom:1px solid #f0f0f0;">
      <td style="padding:12px 8px;font-size:14px;">${item.product_name}</td>
      <td style="padding:12px 8px;text-align:center;font-size:14px;">${item.quantity}</td>
      <td style="padding:12px 8px;text-align:right;font-size:14px;font-weight:600;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `
    )
    .join("");

  await resend.emails.send({
    from: FROM,
    to: "customer@example.com", // Replace with actual user email lookup
    subject: `Order Confirmed! #${orderNumber} — NexCart`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

          <!-- Header -->
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#9333ea);padding:12px 24px;border-radius:12px;">
              <span style="color:white;font-size:24px;font-weight:800;">NexCart</span>
            </div>
          </div>

          <!-- Card -->
          <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="font-size:48px;margin-bottom:8px;">🎉</div>
              <h1 style="margin:0;font-size:24px;color:#111827;">Order Confirmed!</h1>
              <p style="margin:8px 0 0;color:#6b7280;font-size:15px;">Thank you for shopping with NexCart</p>
            </div>

            <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:24px 0;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:13px;">Order Number</p>
              <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#7c3aed;">#${orderNumber}</p>
            </div>

            <!-- Items -->
            <table style="width:100%;border-collapse:collapse;margin:24px 0;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th style="padding:10px 8px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Item</th>
                  <th style="padding:10px 8px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
                  <th style="padding:10px 8px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding:16px 8px;font-weight:700;font-size:16px;">Order Total</td>
                  <td style="padding:16px 8px;text-align:right;font-weight:700;font-size:18px;color:#7c3aed;">₹${total.toLocaleString("en-IN")}</td>
                </tr>
              </tfoot>
            </table>

            <!-- CTA -->
            <div style="text-align:center;margin:24px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${params.orderId}"
                style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;">
                Track Your Order
              </a>
            </div>

            <p style="text-align:center;color:#6b7280;font-size:13px;margin:0;">
              Questions? <a href="mailto:support@nexcart.com" style="color:#7c3aed;">support@nexcart.com</a>
            </p>
          </div>

          <!-- Footer -->
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px;">
            © ${new Date().getFullYear()} NexCart. All rights reserved.
            <br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy" style="color:#9ca3af;">Privacy Policy</a>
            &nbsp;·&nbsp;
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color:#9ca3af;">Terms of Service</a>
          </p>
        </div>
      </body>
      </html>
    `,
  });
}

// ─── OTP Email ────────────────────────────────────────────────────────────────

export async function sendOtpEmail(email: string, otp: string, name?: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${otp} — Your NexCart Verification Code`,
    html: `
      <div style="max-width:400px;margin:40px auto;font-family:-apple-system,sans-serif;">
        <div style="text-align:center;background:linear-gradient(135deg,#7c3aed,#9333ea);padding:24px;border-radius:16px 16px 0 0;">
          <span style="color:white;font-size:22px;font-weight:800;">NexCart</span>
        </div>
        <div style="background:white;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <h2 style="margin:0 0 8px;font-size:20px;">Hi ${name ?? "there"}! 👋</h2>
          <p style="color:#6b7280;margin:0 0 24px;">Your verification code is:</p>
          <div style="background:#f8fafc;border:2px dashed #7c3aed;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px;">
            <span style="font-size:36px;font-weight:800;color:#7c3aed;letter-spacing:8px;">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:14px;margin:0;">This code expires in <strong>10 minutes</strong>. Never share it with anyone.</p>
        </div>
      </div>
    `,
  });
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Welcome to NexCart, ${name}! 🎉`,
    html: `
      <div style="max-width:500px;margin:40px auto;font-family:-apple-system,sans-serif;">
        <div style="background:linear-gradient(135deg,#7c3aed,#9333ea);padding:32px;border-radius:16px 16px 0 0;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🛍️</div>
          <h1 style="color:white;margin:0;font-size:24px;">Welcome to NexCart!</h1>
        </div>
        <div style="background:white;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <h2 style="margin:0 0 12px;">Hi ${name}! 👋</h2>
          <p style="color:#6b7280;">You've successfully joined NexCart — your premium shopping destination.</p>
          <div style="margin:24px 0;display:grid;gap:12px;">
            ${["🔥 Exclusive deals & flash sales", "📦 Free shipping on orders ₹499+", "🔄 Hassle-free 7-day returns", "🤖 AI-powered recommendations"].map(
              (feat) => `<div style="background:#f8fafc;border-radius:8px;padding:12px 16px;font-size:14px;">${feat}</div>`
            ).join("")}
          </div>
          <div style="text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/products"
              style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;">
              Start Shopping →
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

// ─── Password Reset Email ─────────────────────────────────────────────────────

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset Your NexCart Password",
    html: `
      <div style="max-width:500px;margin:40px auto;font-family:-apple-system,sans-serif;">
        <div style="background:white;padding:32px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="font-size:40px;margin-bottom:12px;">🔐</div>
            <h1 style="margin:0;font-size:22px;">Reset Your Password</h1>
            <p style="color:#6b7280;margin:8px 0 0;font-size:15px;">Click the button below to reset your password</p>
          </div>
          <div style="text-align:center;margin:24px 0;">
            <a href="${resetUrl}"
              style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;">
              Reset Password
            </a>
          </div>
          <p style="color:#9ca3af;font-size:13px;text-align:center;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
          <div style="margin-top:16px;padding:12px;background:#fef2f2;border-radius:8px;">
            <p style="margin:0;font-size:12px;color:#ef4444;">⚠️ Never share this link with anyone, including NexCart staff.</p>
          </div>
        </div>
      </div>
    `,
  });
}

// ─── Shipping Update Email ────────────────────────────────────────────────────

export async function sendShippingUpdateEmail(
  email: string,
  orderNumber: string,
  status: string,
  trackingNumber?: string,
  trackingUrl?: string
) {
  const statusMessages: Record<string, { title: string; emoji: string }> = {
    shipped: { title: "Your order is on its way!", emoji: "🚚" },
    out_for_delivery: { title: "Out for delivery!", emoji: "📦" },
    delivered: { title: "Order delivered!", emoji: "✅" },
  };

  const { title, emoji } = statusMessages[status] ?? { title: "Order Update", emoji: "📋" };

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${emoji} ${title} — Order #${orderNumber}`,
    html: `
      <div style="max-width:500px;margin:40px auto;font-family:-apple-system,sans-serif;">
        <div style="background:white;padding:32px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">${emoji}</div>
          <h1 style="margin:0 0 8px;font-size:22px;">${title}</h1>
          <p style="color:#6b7280;margin:0 0 24px;">Order #${orderNumber}</p>
          ${trackingNumber ? `<div style="background:#f8fafc;border-radius:8px;padding:16px;margin:0 0 24px;">
            <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">Tracking Number</p>
            <p style="margin:0;font-weight:700;font-size:16px;">${trackingNumber}</p>
          </div>` : ""}
          ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;">Track Package</a>` : ""}
        </div>
      </div>
    `,
  });
}
