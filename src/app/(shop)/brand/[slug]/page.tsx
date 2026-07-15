import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getBrandBySlug, listProducts, type ProductFilters as Filters } from "@/lib/data/products";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: brand.meta_title ?? brand.name,
    description: brand.meta_description ?? brand.description ?? undefined,
  };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const filters: Filters = {
    brandSlug: slug,
    sort: (sp.sort as Filters["sort"]) ?? "relevance",
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    minRating: sp.minRating ? Number(sp.minRating) : undefined,
    page: sp.page ? Number(sp.page) : 1,
  };

  const { products, total, page, totalPages } = await listProducts(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Brands", href: "/brand" }, { label: brand.name }]} />

      <div className="mt-4 mb-6 flex items-center gap-4">
        {brand.logo_url && (
          <div className="relative size-14 shrink-0">
            <Image src={brand.logo_url} alt={brand.name} fill className="object-contain" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{brand.name}</h1>
          <p className="text-sm text-muted-foreground">{total} products</p>
        </div>
      </div>
      {brand.description && (
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{brand.description}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Suspense>
          <ProductFilters />
        </Suspense>
        <div>
          <ProductGrid products={products} />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            basePath={`/brand/${slug}`}
            searchParams={sp}
          />
        </div>
      </div>
    </div>
  );
}
