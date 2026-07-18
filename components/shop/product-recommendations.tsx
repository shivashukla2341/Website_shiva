"use client";

import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductRecommendationsProps {
  currentProductId: string;
  category: string;
}

export function ProductRecommendations({ currentProductId, category }: ProductRecommendationsProps) {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    // Simulate AI fetching relevant products based on the current product
    // In a real app, this would call an endpoint that queries a vector DB (like Supabase pgvector)
    // or an AI model to find semantic matches or "customers also bought" relationships.
    const fetchRecommendations = async () => {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock recommendations
      setRecommendations([
        {
          id: "rec-1",
          name: "Premium Wireless Earbuds",
          slug: "premium-wireless-earbuds",
          price: 24900,
          originalPrice: 29900,
          images: [{ url: "https://picsum.photos/seed/rec1/400/400" }],
          category: { name: "Audio" },
          brand: { name: "Sony" },
        },
        {
          id: "rec-2",
          name: "Smart Watch Series 9",
          slug: "smart-watch-series-9",
          price: 41900,
          images: [{ url: "https://picsum.photos/seed/rec2/400/400" }],
          category: { name: "Wearables" },
          brand: { name: "Apple" },
        },
        {
          id: "rec-3",
          name: "Magnetic Wireless Charger",
          slug: "magnetic-wireless-charger",
          price: 4900,
          originalPrice: 6500,
          images: [{ url: "https://picsum.photos/seed/rec3/400/400" }],
          category: { name: "Accessories" },
          brand: { name: "Anker" },
        },
        {
          id: "rec-4",
          name: "Leather Phone Case",
          slug: "leather-phone-case",
          price: 5900,
          images: [{ url: "https://picsum.photos/seed/rec4/400/400" }],
          category: { name: "Accessories" },
          brand: { name: "Nomad" },
        }
      ]);
      
      setLoading(false);
    };

    fetchRecommendations();
  }, [currentProductId]);

  return (
    <div className="py-12 border-t mt-16">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Sparkles className="w-4 h-4" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">AI Recommended for You</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
