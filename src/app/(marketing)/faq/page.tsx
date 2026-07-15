import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about orders, shipping, returns, and payments.",
};

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Most orders arrive within 3-5 business days. You'll see an estimated delivery date at checkout and can track your order any time from My Orders.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes — orders over ₹499 ship free. Orders below that threshold have a flat ₹49 shipping fee.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships, you'll get a tracking link by email and can also view live status under Account → Orders.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What's your return policy?",
        a: "Most items can be returned within 7 days of delivery, unused and in original packaging. See our Refund Policy for category-specific exceptions.",
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive your returned item, refunds are processed within 5-7 business days back to your original payment method.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We support UPI, credit/debit cards, net banking, popular wallets, and Cash on Delivery, powered by Razorpay and Stripe.",
      },
      {
        q: "Is it safe to save my card details?",
        a: "Yes. We never store your raw card number — payments are tokenized and processed by PCI-DSS compliant providers.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "How do I reset my password?",
        a: "Go to the login page and click 'Forgot password?' — we'll email you a secure reset link.",
      },
      {
        q: "Can I have multiple delivery addresses?",
        a: "Yes, you can save unlimited addresses in your Address Book and pick one at checkout.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
      <p className="mt-2 text-muted-foreground">
        Can&apos;t find what you&apos;re looking for?{" "}
        <a href="/contact" className="text-primary hover:underline">
          Contact our support team
        </a>
        .
      </p>

      <div className="mt-10 space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="mb-3 text-lg font-semibold">{section.category}</h2>
            <Accordion type="single" collapsible className="rounded-2xl border border-border/60 bg-card px-2 shadow-soft">
              {section.items.map((item, i) => (
                <AccordionItem key={i} value={`${section.category}-${i}`}>
                  <AccordionTrigger className="px-2 text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="px-2 text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
