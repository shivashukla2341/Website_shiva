import Link from "next/link";
import Image from "next/image";

import type { CategoryTileData } from "@/types/catalog";

export function CategoryGrid({ categories }: { categories: CategoryTileData[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Shop by Category</h2>
        <Link href="/category" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border/60 bg-card p-3 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="relative size-16 overflow-hidden rounded-full bg-muted sm:size-20">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-xs font-medium sm:text-sm">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
