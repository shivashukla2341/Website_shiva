import { Suspense } from "react";
import { Metadata } from "next";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/shop/product-card";
import { ProductFilters } from "@/components/shop/product-filters";
import { ProductSort } from "@/components/shop/product-sort";

const BRANDS: Record<string, string> = {
  apple: "Apple",
  samsung: "Samsung",
  nike: "Nike",
  adidas: "Adidas",
  sony: "Sony",
};

const MOCK_PRODUCTS = Array.from({ length: 6 }).map((_, i) => ({
  id: `brand-prod-${i}`,
  name: `Brand Product ${i + 1}`,
  slug: `brand-product-${i + 1}`,
  description: "High quality premium product from this brand.",
  price: 2999 + i * 1000,
  compareAtPrice: 3999 + i * 1000,
  images: [{ url: `https://picsum.photos/seed/${i + 500}/400/400`, isDefault: true }],
  categoryId: "cat-1",
  averageRating: 4.6,
  reviewCount: 300,
  isNewArrival: i === 0,
  isBestSeller: i === 1,
}));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = BRANDS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${name} | NexCart`,
    description: `Shop the best products from ${name} on NexCart.`,
  };
}

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const name = BRANDS[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const products = MOCK_PRODUCTS;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          <p className="mt-2 text-muted-foreground">
            Showing {products.length} products from {name}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 md:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6 overflow-y-auto">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ProductFilters />
              </Suspense>
            </SheetContent>
          </Sheet>

          <Suspense fallback={<div className="h-9 w-[180px] bg-muted animate-pulse rounded-md" />}>
            <ProductSort />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="hidden md:block col-span-1 border-r pr-8 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ProductFilters />
          </Suspense>
        </aside>

        <div className="col-span-1 md:col-span-3">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <SlidersHorizontal className="h-10 w-10 text-muted-foreground opacity-50" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <Button variant="outline">Clear Filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
