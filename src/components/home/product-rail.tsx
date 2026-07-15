import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/types/catalog";

export function ProductRail({
  title,
  subtitle,
  viewAllHref,
  products,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  products: ProductCardData[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
