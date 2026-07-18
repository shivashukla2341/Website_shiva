"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard, ProductCardSkeleton } from "@/components/shop/product-card";
import type { Product } from "@/types";

// Mock products — replace with API/RSC data fetch
const MOCK_PRODUCTS: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 10),
  slug: `product-${i + 10}`,
  name: ["Sony WH-1000XM5 Headphones", "iPhone 15 Pro Max", "Nike Air Max 270", "Samsung 4K QLED TV",
    "MacBook Pro M3", "Dyson V15 Detect", "Levi's 511 Slim Jeans", "Kindle Paperwhite"][i] ?? `Product ${i}`,
  price: [24999, 134999, 12999, 89999, 199999, 49999, 3999, 14999][i] ?? 9999,
  compareAtPrice: [39999, undefined, 14999, 59999, 10999, undefined, 2499, 99999][i],
  averageRating: [4.9, 4.9, 4.6, 4.7, 4.5, 4.8, 4.3, 4.8][i],
  reviewCount: [1234, 4532, 892, 543, 231, 89, 45, 122][i],
  description: "Amazing product with great features",
  categoryId: "cat-1",
  images: [{ id: String(i), productId: String(i + 10), url: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
  ][i] ?? "", sortOrder: 0, isDefault: true }],
  tags: [], status: "active" as const, isFeatured: i < 4, isTrending: i >= 4, isBestSeller: i % 3 === 0, isNewArrival: i % 2 === 0,
  taxRate: 18, taxInclusive: false, hasVariants: false, viewCount: 0, soldCount: 0,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}));

export function FeaturedProducts() {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.isFeatured);
  const newArrivals = MOCK_PRODUCTS.filter((p) => p.isNewArrival);
  const bestSellers = MOCK_PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">
              Curated For You
            </p>
            <h2 className="section-heading flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              Top Picks
            </h2>
          </div>
          <Link href="/products" className="hidden sm:inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted hover:text-foreground">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <Tabs defaultValue="featured">
          <TabsList className="mb-6 h-10 rounded-xl">
            <TabsTrigger value="featured" className="rounded-lg text-sm">Featured</TabsTrigger>
            <TabsTrigger value="new" className="rounded-lg text-sm">New Arrivals</TabsTrigger>
            <TabsTrigger value="best" className="rounded-lg text-sm">Best Sellers</TabsTrigger>
          </TabsList>

          {[
            { value: "featured", products: featuredProducts },
            { value: "new", products: newArrivals },
            { value: "best", products: bestSellers },
          ].map(({ value, products }) => (
            <TabsContent key={value} value={value}>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/products" className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted hover:text-foreground">
            View All Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
