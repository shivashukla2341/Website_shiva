import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getCategoryBySlug, listProducts, type ProductFilters as Filters } from "@/lib/data/products";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.meta_title ?? category.name,
    description: category.meta_description ?? category.description ?? undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const filters: Filters = {
    categorySlug: slug,
    sort: (sp.sort as Filters["sort"]) ?? "relevance",
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    minRating: sp.minRating ? Number(sp.minRating) : undefined,
    page: sp.page ? Number(sp.page) : 1,
  };

  const { products, total, page, totalPages } = await listProducts(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Category", href: "/category" }, { label: category.name }]} />

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{category.name}</h1>
        {category.description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">{total} products</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Suspense>
          <ProductFilters />
        </Suspense>
        <div>
          <ProductGrid products={products} />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            basePath={`/category/${slug}`}
            searchParams={sp}
          />
        </div>
      </div>
    </div>
  );
}
