import { Metadata } from "next";
import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";

export const metadata: Metadata = {
  title: "My Wishlist | NexCart",
  description: "View your saved items.",
};

// Mock Data
const WISHLIST_ITEMS = Array.from({ length: 4 }).map((_, i) => ({
  id: `wish-${i}`,
  name: `Saved Product ${i + 1}`,
  slug: `saved-product-${i + 1}`,
  description: "High quality premium product with amazing features.",
  price: 4999 + i * 1000,
  compareAtPrice: 5999 + i * 1000,
  images: [{ url: `https://picsum.photos/seed/${i + 300}/400/400`, isDefault: true }],
  categoryId: "cat-1",
  averageRating: 4.8,
  reviewCount: 120,
  isNewArrival: false,
  isBestSeller: true,
}));

export default function WishlistPage() {
  const items = WISHLIST_ITEMS;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <HeartCrack className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Save items you love to your wishlist to easily find them later.
          </p>
          <Button asChild>
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={item as any} />
          ))}
        </div>
      )}
    </div>
  );
}
