"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="size-9 text-emerald-500" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Order placed successfully!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {orderNumber
          ? `Your order ${orderNumber} has been confirmed. A confirmation email is on its way.`
          : "Your order has been confirmed. A confirmation email is on its way."}
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/account/orders">View Orders</Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
