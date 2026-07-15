import type { ProductCardData } from "@/types/catalog";
import type { ProductListItem } from "@/lib/data/products";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";

export function toProductCardData(product: ProductListItem): ProductCardData {
  const sortedMedia = [...(product.product_media ?? [])].sort(
    (a, b) => a.display_order - b.display_order
  );

  let badge: ProductCardData["badge"];
  if (product.is_best_seller) badge = "Best Seller";
  else if (product.is_trending) badge = "Trending";
  else if (product.is_featured) badge = "New";

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: sortedMedia[0]?.url ?? FALLBACK_IMAGE,
    price: product.base_price,
    compareAtPrice: product.compare_at_price,
    rating: product.avg_rating,
    reviewCount: product.review_count,
    badge,
  };
}
