import type { Metadata } from "next";

import { PageShell } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Delivery timelines, shipping charges, and order tracking details.",
};

export default function ShippingPolicyPage() {
  return (
    <PageShell title="Shipping Policy" subtitle="Last updated: January 2026">
      <h2>Delivery Timelines</h2>
      <p>
        Standard delivery takes 3-5 business days for most pin codes; metro cities typically see
        1-3 business days. Estimated delivery dates are shown on the product page and again at
        checkout based on your pin code.
      </p>

      <h2>Shipping Charges</h2>
      <ul>
        <li>Free shipping on all orders over ₹499.</li>
        <li>A flat ₹49 shipping fee applies to orders below ₹499.</li>
        <li>Some bulky or heavy items may carry an additional handling fee, clearly shown before checkout.</li>
      </ul>

      <h2>Order Tracking</h2>
      <p>
        Once your order ships, you&apos;ll receive a tracking link via email and can also track it
        live from Account → Orders → Order Details.
      </p>

      <h2>Delivery Attempts</h2>
      <p>
        Our courier partners attempt delivery up to 2 times. If both attempts fail, the order is
        returned to the seller and a refund is initiated (for prepaid orders) within 5-7 business
        days.
      </p>

      <h2>Serviceable Areas</h2>
      <p>
        We currently ship across India. International shipping is not yet available but is on our
        roadmap.
      </p>
    </PageShell>
  );
}
