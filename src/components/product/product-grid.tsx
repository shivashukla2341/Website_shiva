import { PackageSearch } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { toProductCardData } from "@/lib/data/mappers";
import type { ProductListItem } from "@/lib/data/products";

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
        <PackageSearch className="size-10 text-muted-foreground" />
        <p className="mt-4 text-sm font-medium">No products found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={toProductCardData(product)} />
      ))}
    </div>
  );
}
