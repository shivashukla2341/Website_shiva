"use client";
import { TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types";

const TRENDING: Product[] = Array.from({ length: 4 }, (_, i) => ({
  id: String(i + 20), slug: `trending-${i}`,
  name: ["AirPods Pro 2", "PS5 DualSense Controller", "Fitbit Sense 2", "Bose QuietComfort 45"][i],
  price: [24999, 6999, 22999, 28999][i], compareAtPrice: [29999, 8999, 29999, 35999][i],
  averageRating: [4.8, 4.7, 4.5, 4.9][i], reviewCount: [892, 456, 1203, 2341][i],
  description: "Amazing product with great features",
  categoryId: "cat-1",
  images: [{ id: `img-${i}`, productId: String(i+20), url: [
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400",
    "https://images.unsplash.com/photo-1606140188-9-30547a?w=400",
    "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  ][i] ?? "", sortOrder: 0, isDefault: true }],
  tags: [], status: "active" as const, isFeatured: false, isTrending: true, isBestSeller: false, isNewArrival: false,
  taxRate: 18, taxInclusive: false, hasVariants: false, viewCount: 0, soldCount: 0,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}));

export function TrendingProducts() {
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
          {TRENDING.map((p) => <ProductCard key={p.id} product={p} showBadge="trending" />)}
        </div>
      </div>
    </section>
  );
}
