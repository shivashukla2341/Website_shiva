"use client";

// =============================================================================
// NEXCART — FLASH SALE SECTION with Countdown
// =============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types";

// Mock flash sale products (replace with API data)
const FLASH_PRODUCTS: Partial<Product>[] = [
  {
    id: "1", name: "Premium Wireless Headphones", slug: "premium-wireless-headphones",
    price: 2999, compareAtPrice: 7999, averageRating: 4.5, reviewCount: 128,
    images: [{ id: "1", productId: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", sortOrder: 0, isDefault: true }],
    tags: ["electronics", "audio"], status: "active" as const, isFeatured: false, isTrending: true, isBestSeller: false, isNewArrival: false, taxRate: 18, taxInclusive: false, hasVariants: false, viewCount: 0, soldCount: 0, createdAt: "", updatedAt: ""
  },
  {
    id: "2", name: "Smart Watch Series 8", slug: "smart-watch-series-8",
    price: 8499, compareAtPrice: 15999, averageRating: 4.7, reviewCount: 89,
    images: [{ id: "2", productId: "2", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", sortOrder: 0, isDefault: true }],
    tags: ["watches"], status: "active" as const, isFeatured: false, isTrending: true, isBestSeller: false, isNewArrival: false, taxRate: 18, taxInclusive: false, hasVariants: false, viewCount: 0, soldCount: 0, createdAt: "", updatedAt: ""
  },
  {
    id: "3", name: "4K Action Camera Pro", slug: "4k-action-camera-pro",
    price: 6999, compareAtPrice: 12999, averageRating: 4.3, reviewCount: 56,
    images: [{ id: "3", productId: "3", url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop", sortOrder: 0, isDefault: true }],
    tags: ["cameras"], status: "active" as const, isFeatured: false, isTrending: true, isBestSeller: false, isNewArrival: false, taxRate: 18, taxInclusive: false, hasVariants: false, viewCount: 0, soldCount: 0, createdAt: "", updatedAt: ""
  },
  {
    id: "4", name: "Mechanical Gaming Keyboard", slug: "mechanical-gaming-keyboard",
    price: 3499, compareAtPrice: 6499, averageRating: 4.6, reviewCount: 201,
    images: [{ id: "4", productId: "4", url: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop", sortOrder: 0, isDefault: true }],
    tags: ["electronics", "gaming"], status: "active" as const, isFeatured: false, isTrending: true, isBestSeller: false, isNewArrival: false, taxRate: 18, taxInclusive: false, hasVariants: false, viewCount: 0, soldCount: 0, createdAt: "", updatedAt: ""
  },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, targetDate.getTime() - now);
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-foreground text-background text-xl md:text-2xl font-bold font-mono">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function FlashSaleSection() {
  // Sale ends in 8 hours from now (example)
  const [saleEnd] = useState(
    () => new Date(Date.now() + 8 * 60 * 60 * 1000)
  );
  const timeLeft = useCountdown(saleEnd);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-orange-500/5 via-rose-500/5 to-pink-500/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="mb-2 gradient-bg text-white border-0 text-xs font-bold px-3 py-1">
              <Zap className="mr-1 h-3 w-3 fill-white" />
              Flash Sale
            </Badge>
            <h2 className="section-heading">Today&apos;s Best Deals</h2>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Ends in:</span>
            <div className="flex items-center gap-2">
              <CountdownUnit value={timeLeft.hours} label="hrs" />
              <span className="text-xl font-bold text-muted-foreground mb-5">:</span>
              <CountdownUnit value={timeLeft.minutes} label="min" />
              <span className="text-xl font-bold text-muted-foreground mb-5">:</span>
              <CountdownUnit value={timeLeft.seconds} label="sec" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FLASH_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product as Product} showBadge="sale" />
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-8 text-center">
          <Link href="/offers" className="inline-flex h-9 items-center justify-center rounded-lg border-2 border-border bg-background px-4 text-sm font-medium hover:bg-muted hover:text-foreground">
            View All Flash Deals
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
