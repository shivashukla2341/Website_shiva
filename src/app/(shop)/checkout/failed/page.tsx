import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CheckoutFailedPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="size-9 text-destructive" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Payment failed</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn&apos;t process your payment. No amount has been charged. Please try again or use a
        different payment method.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/cart">Back to Cart</Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/checkout">Try Again</Link>
        </Button>
      </div>
    </div>
  );
}
