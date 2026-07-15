import type { Metadata } from "next";

import { ProductGrid } from "@/components/product/product-grid";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { createClient } from "@/lib/supabase/server";
import type { ProductListItem } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Offers & Deals",
  description: "The best discounts across every category, updated daily.",
};

const PAGE_SIZE = 24;

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = sp.page ? Number(sp.page) : 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data, count } = await supabase
    .from("products")
    .select(
      "id, slug, name, base_price, compare_at_price, avg_rating, review_count, is_featured, is_trending, is_best_seller, product_media ( url, display_order )",
      { count: "exact" }
    )
    .eq("status", "active")
    .not("compare_at_price", "is", null)
    .order("compare_at_price", { ascending: false })
    .range(from, to);

  const products = (data ?? []) as unknown as ProductListItem[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Offers" }]} />
      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Offers &amp; Deals</h1>
        <p className="mt-1 text-sm text-muted-foreground">{count ?? 0} products on sale right now</p>
      </div>

      <ProductGrid products={products} />
      <PaginationControls page={page} totalPages={totalPages} basePath="/offers" searchParams={sp} />
    </div>
  );
}
