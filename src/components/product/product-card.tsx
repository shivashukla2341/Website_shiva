"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDiscountPercent } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductCardData } from "@/types/catalog";

export function ProductCard({ product }: { product: ProductCardData }) {
  const { toggle, has } = useWishlistStore();
  const inWishlist = has(product.id);
  const discount = formatDiscountPercent(product.price, product.compareAtPrice);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.badge && (
            <Badge className="bg-gradient-brand border-0 text-white shadow-soft">
              {product.badge}
            </Badge>
          )}
          {discount && (
            <Badge variant="secondary" className="shadow-soft">
              {discount}% off
            </Badge>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
            });
          }}
          aria-label="Toggle wishlist"
          className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
        >
          <Heart
            className={cn("size-4", inWishlist ? "fill-destructive text-destructive" : "text-foreground/70")}
          />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-foreground/90 transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-foreground/80">{product.rating}</span>
          <span>({product.reviewCount.toLocaleString("en-IN")})</span>
        </div>

        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-base font-bold">{formatCurrency(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>

        <Button size="sm" className="mt-1 w-full rounded-full">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
