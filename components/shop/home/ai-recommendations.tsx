"use client";
import { Sparkles, MessageSquare, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types";

// Placeholder — real data from /api/ai/recommendations
const AI_PICKS = Array.from({ length: 4 }, (_, i) => ({
  id: String(i + 30), slug: `ai-pick-${i}`,
  name: ["Canon EOS R50", "Dell XPS 15", "Roborock S7", "Instant Pot Duo"][i],
  price: [62999, 139999, 34999, 8999][i], compareAtPrice: [79999, 159999, 44999, 11999][i],
  averageRating: [4.7, 4.8, 4.9, 4.6][i], reviewCount: [234, 1023, 567, 2341][i],
  description: "Amazing product with great features",
  categoryId: "cat-1",
  images: [{ id: String(i), productId: String(i + 30), url: [
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
  ][i] ?? "", sortOrder: 0, isDefault: true }],
  tags: [], status: "active" as const, isFeatured: true, isTrending: false, isBestSeller: false, isNewArrival: false,
  taxRate: 18, taxInclusive: false, hasVariants: false, viewCount: 0, soldCount: 0,
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
}));

export function AIRecommendations() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              Powered by AI
            </div>
            <h2 className="section-heading mt-1">Recommended for You</h2>
            <p className="text-sm text-muted-foreground mt-1">Personalized picks based on your interests</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary">
            <MessageSquare className="h-3.5 w-3.5" />
            Ask AI Assistant
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {AI_PICKS.map((p) => <ProductCard key={p.id} product={p} showBadge="featured" />)}
        </div>
      </div>
    </section>
  );
}
