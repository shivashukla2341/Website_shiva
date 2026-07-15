"use client";

import * as React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/types/catalog";

function useCountdown(endsAt: string) {
  // Server can't know "now" the same instant the client hydrates, so the
  // first render must be deterministic (null) — the real value is only
  // computed client-side, after mount, to avoid a hydration mismatch.
  const [remaining, setRemaining] = React.useState<number | null>(null);

  React.useEffect(() => {
    const tick = () => setRemaining(Math.max(0, new Date(endsAt).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (remaining === null) return null;

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  return { hours, minutes, seconds };
}

export function FlashSaleBanner({
  name,
  endsAt,
  products,
}: {
  name: string;
  endsAt: string;
  products: ProductCardData[];
}) {
  const countdown = useCountdown(endsAt);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-gradient-brand relative overflow-hidden rounded-3xl p-6 shadow-elevated sm:p-8">
        <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <Zap className="size-6 fill-white" />
            <h2 className="text-2xl font-bold">{name}</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
            {[countdown?.hours ?? 0, countdown?.minutes ?? 0, countdown?.seconds ?? 0].map((unit, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="rounded-lg bg-white/20 px-2.5 py-1.5 backdrop-blur">
                  {countdown ? String(unit).padStart(2, "0") : "--"}
                </span>
                {i < 2 && <span>:</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link
          href="/offers"
          className="relative z-10 mt-6 inline-block text-sm font-semibold text-white underline-offset-4 hover:underline"
        >
          See all flash sale deals →
        </Link>
      </div>
    </section>
  );
}
