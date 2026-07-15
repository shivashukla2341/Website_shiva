"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { formatCurrency } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <Heart className="size-14 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Your wishlist is empty</h1>
        <p className="mt-1 text-sm text-muted-foreground">Save items you love to find them here later.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/">Discover Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="mt-4 mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
        Wishlist ({items.length})
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft"
          >
            <Link href={`/products/${item.slug}`} className="relative aspect-square overflow-hidden bg-muted">
              <Image src={item.image} alt={item.name} fill sizes="25vw" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-3.5">
              <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary">
                {item.name}
              </Link>
              <span className="text-base font-bold">{formatCurrency(item.price)}</span>
              <div className="mt-auto flex gap-2">
                <Button size="sm" className="flex-1 rounded-full" asChild>
                  <Link href={`/products/${item.slug}`}>
                    <ShoppingBag className="size-3.5" /> View
                  </Link>
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Remove from wishlist"
                  onClick={() => remove(item.productId)}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
