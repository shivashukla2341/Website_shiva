import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/shop/product-card";
import { ProductFilters } from "@/components/shop/product-filters";
import { ProductSort } from "@/components/shop/product-sort";

export const metadata: Metadata = {
  title: "Search Results | NexCart",
  description: "Search for products on NexCart.",
};

import { createClient } from "@/lib/supabase/server";

// Removed MOCK_PRODUCTS

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sParams = await searchParams;
  const q = typeof sParams.q === 'string' ? sParams.q : '';

  if (!q) {
    redirect('/products');
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .ilike('name', `%${q}%`);
  const products = data || [];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          <p className="mt-2 text-muted-foreground">
            Showing {products.length} results for <span className="font-semibold text-foreground">"{q}"</span>
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
              <h2 className="text-xl font-semibold mb-2">No results found for "{q}"</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Try checking your spelling or use more general terms.
              </p>
              <Button variant="outline" asChild>
                <a href="/products">Clear Search</a>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="default" size="sm" className="w-9">1</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
