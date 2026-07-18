"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard, ProductCardSkeleton } from "@/components/shop/product-card";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestSellers = products.filter((p) => p.isBestSeller);

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
