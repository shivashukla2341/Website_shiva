export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  rating: number;
  reviewCount: number;
  badge?: "Best Seller" | "Trending" | "New" | "Flash Sale";
};

export type CategoryTileData = {
  id: string;
  slug: string;
  name: string;
  image: string;
};
