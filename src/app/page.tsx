import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductRail } from "@/components/home/product-rail";
import { FlashSaleBanner } from "@/components/home/flash-sale-banner";
import { featuredCategories, featuredProducts, flashSale } from "@/lib/mock/catalog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid categories={featuredCategories} />
      <FlashSaleBanner name={flashSale.name} endsAt={flashSale.endsAt} products={flashSale.products} />
      <ProductRail
        title="Trending Now"
        subtitle="Handpicked products our customers love"
        viewAllHref="/offers"
        products={featuredProducts}
      />
      <ProductRail
        title="Best Sellers"
        subtitle="Top-rated across every category"
        viewAllHref="/category/electronics"
        products={[...featuredProducts].reverse()}
      />
    </>
  );
}
