import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { listCategories } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop by Category",
  description: "Browse every category available on Website Shiva.",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";

export default async function AllCategoriesPage() {
  const categories = await listCategories();
  const topLevel = categories.filter((c) => !c.parent_id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Category" }]} />
      <h1 className="mt-4 mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
        Shop by Category
      </h1>

      {topLevel.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topLevel.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={category.image_url ?? FALLBACK_IMAGE}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold">{category.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
