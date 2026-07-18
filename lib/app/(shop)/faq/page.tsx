import { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | NexCart",
  description: "Find answers to common questions about shopping on NexCart.",
};

const FAQS = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long will my order take to arrive?",
        a: "Orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days depending on your location."
      },
      {
        q: "How can I track my order?",
        a: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package. You can also track your order from your account dashboard."
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within India. We are working on expanding our logistics network to support international shipping in the near future."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return policy for most items. The product must be unused, in its original packaging, and with all tags attached. Some items like electronics may have different return conditions."
      },
      {
        q: "How do I initiate a return?",
        a: "You can initiate a return directly from your account dashboard under 'My Orders'. Alternatively, you can contact our support team to help you with the process."
      },
      {
        q: "When will I receive my refund?",
        a: "Once we receive and inspect the returned item, we will process your refund within 3-5 business days. The amount will be credited back to your original payment method."
      }
    ]
  },
  {
    category: "Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI (GPay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD) for eligible pincodes."
      },
      {
        q: "Is it safe to use my credit card on your site?",
        a: "Absolutely. Our website uses industry-standard SSL encryption to protect your personal and payment information. We do not store your credit card details on our servers."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about shopping with us.
          </p>
        </div>

        <div className="space-y-12">
          {FAQS.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold mb-6">{section.category}</h2>
              <Accordion type="single" collapsible className="w-full bg-card border rounded-2xl px-6">
                {section.questions.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${idx}-${i}`} className="border-b last:border-0">
                    <AccordionTrigger className="text-left font-medium py-4 hover:no-underline hover:text-primary">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-muted/50 rounded-2xl p-8 border">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">If you couldn't find the answer you're looking for, our support team is here to help.</p>
          <Button asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
