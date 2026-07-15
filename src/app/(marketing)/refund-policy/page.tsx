import type { Metadata } from "next";

import { PageShell } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Our return, cancellation, and refund process explained.",
};

export default function RefundPolicyPage() {
  return (
    <PageShell title="Refund Policy" subtitle="Last updated: January 2026">
      <h2>Return Window</h2>
      <p>
        Most products can be returned within 7 days of delivery, provided they are unused, in
        original packaging, and with all tags/accessories intact. Perishables, personal care
        items, and made-to-order products are not eligible for return unless defective.
      </p>

      <h2>How to Request a Return</h2>
      <ol>
        <li>Go to Account → Orders and select the item you&apos;d like to return.</li>
        <li>Choose a reason and, if applicable, upload photos.</li>
        <li>Once approved, schedule a pickup or drop the item at a nearby partner location.</li>
      </ol>

      <h2>Refund Timelines</h2>
      <p>
        Refunds are initiated once the returned item passes quality inspection — typically within
        2 business days of pickup. Funds appear back in your original payment method within 5-7
        business days (UPI/cards) or as store credit for Cash on Delivery orders.
      </p>

      <h2>Cancellations</h2>
      <p>
        Orders can be cancelled free of charge before they are shipped. Once an order has shipped,
        it must go through the standard return process after delivery.
      </p>

      <h2>Damaged or Wrong Items</h2>
      <p>
        If you receive a damaged, defective, or incorrect item, contact us within 48 hours of
        delivery for a free replacement or full refund — no return shipping charge applies.
      </p>
    </PageShell>
  );
}
