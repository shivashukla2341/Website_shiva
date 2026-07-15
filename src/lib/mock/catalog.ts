// Placeholder data for the marketing/home surface until Step 8/9 wires real
// Supabase queries. Shapes mirror src/types/catalog.ts so swapping the data
// source later doesn't require touching the presentation components.
import type { CategoryTileData, ProductCardData } from "@/types/catalog";

export const featuredCategories: CategoryTileData[] = [
  { id: "1", slug: "electronics", name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80" },
  { id: "2", slug: "fashion", name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80" },
  { id: "3", slug: "home-kitchen", name: "Home & Kitchen", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80" },
  { id: "4", slug: "beauty-personal-care", name: "Beauty", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80" },
  { id: "5", slug: "sports-outdoors", name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80" },
  { id: "6", slug: "laptops", name: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80" },
];

export const featuredProducts: ProductCardData[] = [
  {
    id: "p1",
    slug: "apex-phone-15-pro",
    name: "Apex Phone 15 Pro — Titanium, 256GB",
    image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&q=80",
    price: 89999,
    compareAtPrice: 99999,
    rating: 4.7,
    reviewCount: 1284,
    badge: "Best Seller",
  },
  {
    id: "p2",
    slug: "nimbus-runner-shoes",
    name: "Nimbus Runner Shoes — Cloud White",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    price: 4999,
    compareAtPrice: 6999,
    rating: 4.5,
    reviewCount: 532,
    badge: "Trending",
  },
  {
    id: "p3",
    slug: "craftwell-espresso-machine",
    name: "Craftwell Espresso Machine, Barista Series",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    price: 24999,
    compareAtPrice: null,
    rating: 4.8,
    reviewCount: 219,
    badge: "New",
  },
  {
    id: "p4",
    slug: "apex-ultrabook-14",
    name: "Apex Ultrabook 14, 16GB/512GB",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    price: 74999,
    compareAtPrice: 84999,
    rating: 4.6,
    reviewCount: 861,
    badge: "Flash Sale",
  },
  {
    id: "p5",
    slug: "nimbus-wireless-earbuds",
    name: "Nimbus Wireless Earbuds Pro, ANC",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    price: 5999,
    compareAtPrice: 8999,
    rating: 4.4,
    reviewCount: 2103,
  },
  {
    id: "p6",
    slug: "craftwell-ceramic-dinner-set",
    name: "Craftwell 24-Piece Ceramic Dinner Set",
    image: "https://images.unsplash.com/photo-1578991624414-276ef23a534f?w=800&q=80",
    price: 3499,
    compareAtPrice: 4499,
    rating: 4.3,
    reviewCount: 145,
  },
  {
    id: "p7",
    slug: "apex-smartwatch-series-9",
    name: "Apex Smartwatch Series 9, GPS",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    price: 29999,
    compareAtPrice: 34999,
    rating: 4.6,
    reviewCount: 998,
    badge: "Best Seller",
  },
  {
    id: "p8",
    slug: "nimbus-denim-jacket",
    name: "Nimbus Classic Denim Jacket",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    price: 2999,
    compareAtPrice: null,
    rating: 4.2,
    reviewCount: 87,
  },
];

export const flashSale = {
  name: "Weekend Flash Sale",
  endsAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
  products: featuredProducts.filter((p) => p.badge === "Flash Sale" || p.compareAtPrice),
};
