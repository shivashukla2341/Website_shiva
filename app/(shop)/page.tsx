import type { Metadata } from "next";
import { HeroSection } from "@/components/shop/home/hero-section";
import { FeaturedCategories } from "@/components/shop/home/featured-categories";
import { FlashSaleSection } from "@/components/shop/home/flash-sale-section";
import { FeaturedProducts } from "@/components/shop/home/featured-products";
import { BrandShowcase } from "@/components/shop/home/brand-showcase";
import { TrendingProducts } from "@/components/shop/home/trending-products";
import { PromoBanners } from "@/components/shop/home/promo-banners";
import { TestimonialsSection } from "@/components/shop/home/testimonials-section";
import { NewsletterSection } from "@/components/shop/home/newsletter-section";
import { AIRecommendations } from "@/components/shop/home/ai-recommendations";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "NexCart — Premium E-Commerce Experience",
  description:
    "Discover millions of products at unbeatable prices. Shop electronics, fashion, home, beauty & more with fast delivery and easy returns.",
  openGraph: {
    title: "NexCart — Premium E-Commerce Experience",
    description: "Shop the best deals on electronics, fashion, home & more.",
    images: ["/og-home.png"],
  },
};

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.from('products').select('*').eq('status', 'active');
  const products = data || [];

  return (
    <div className="flex flex-col">
      {/* Hero with banner carousel */}
      <HeroSection />

      {/* Category grid */}
      <FeaturedCategories />

      {/* Flash Sale countdown */}
      <FlashSaleSection />

      {/* Featured / New Arrivals */}
      <FeaturedProducts products={products} />

      {/* Promo banners */}
      <PromoBanners />

      {/* Trending products */}
      <TrendingProducts products={products} />

      {/* AI Recommendations */}
      <AIRecommendations />

      {/* Brand showcase */}
      <BrandShowcase />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
