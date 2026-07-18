"use client";
import { TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types";

interface TrendingProductsProps {
  products: Product[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  const trending = products.filter(p => p.isTrending).slice(0, 4);
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">What&apos;s Hot</p>
          <h2 className="section-heading flex items-center justify-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" /> Trending Now
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {trending.map((p) => <ProductCard key={p.id} product={p} showBadge="trending" />)}
        </div>
      </div>
    </section>
  );
}
