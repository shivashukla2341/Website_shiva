import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Return & Refund Policy | NexCart",
  description: "Learn about our return and refund policies.",
};

export default function RefundPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto bg-card border rounded-2xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Return & Refund Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 1, 2024</p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2>1. Return Policy</h2>
          <p>
            We offer a 7-day return window for most items. To be eligible for a return, your item must be unused, 
            in the same condition that you received it, and in its original packaging. You must also have the receipt or proof of purchase.
          </p>
          <p>
            Certain items such as perishable goods, custom products, and personal care items cannot be returned. 
            Please check the specific product page for details.
          </p>

          <h2>2. How to Initiate a Return</h2>
          <p>
            To initiate a return, please follow these steps:
          </p>
          <ol>
            <li>Log in to your account and go to the 'My Orders' section.</li>
            <li>Select the order containing the item you wish to return.</li>
            <li>Click on 'Request Return' and fill out the reason for return.</li>
            <li>Pack the item securely in its original packaging.</li>
            <li>Hand over the package to our delivery partner when they arrive for pickup.</li>
          </ol>

          <h2>3. Refunds</h2>
          <p>
            Once we receive your returned item, our quality check team will inspect it. We will notify you of the approval or rejection of your refund. 
            If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 3-5 business days.
          </p>

          <h2>4. Exchanges</h2>
          <p>
            We only replace items if they are defective or damaged. If you need to exchange an item for the same product, 
            please initiate a return for the damaged item and place a new order for the replacement.
          </p>

          <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-medium m-0">Need help with a return?</p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
