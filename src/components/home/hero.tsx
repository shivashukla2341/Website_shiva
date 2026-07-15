import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-mesh absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
            <Sparkles className="size-3.5 text-primary" />
            New Season Arrivals are here
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            Shopping,{" "}
            <span className="text-gradient-brand">reimagined</span> for the way you live.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Thousands of curated products across electronics, fashion and home —
            fast delivery, secure checkout, and prices you&apos;ll love.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild className="rounded-full px-8 shadow-elevated">
              <Link href="/category/electronics">
                Shop Now <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8">
              <Link href="/offers">Explore Offers</Link>
            </Button>
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold">Free Delivery</dt>
                <dd className="text-xs text-muted-foreground">On orders over ₹499</dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold">Secure Checkout</dt>
                <dd className="text-xs text-muted-foreground">Razorpay &amp; Stripe</dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <dt className="text-sm font-semibold">Easy Returns</dt>
                <dd className="text-xs text-muted-foreground">7-day return window</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
