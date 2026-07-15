import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { listBrands } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "All Brands",
  description: "Browse every brand available on Website Shiva.",
};

export default async function AllBrandsPage() {
  const brands = await listBrands();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Brands" }]} />
      <h1 className="mt-4 mb-6 text-2xl font-bold tracking-tight sm:text-3xl">All Brands</h1>

      {brands.length === 0 ? (
        <p className="text-sm text-muted-foreground">No brands yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              {brand.logo_url ? (
                <div className="relative size-16">
                  <Image src={brand.logo_url} alt={brand.name} fill className="object-contain" />
                </div>
              ) : (
                <div className="bg-gradient-brand flex size-16 items-center justify-center rounded-full text-xl font-bold text-white">
                  {brand.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium">{brand.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
