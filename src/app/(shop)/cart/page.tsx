"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="size-14 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Your cart is empty</h1>
        <p className="mt-1 text-sm text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  const shipping = subtotal() >= 499 ? 0 : 49;
  const tax = Math.round(subtotal() * 0.18);
  const total = subtotal() + shipping + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mt-4 mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
        Shopping Cart ({items.length})
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft"
            >
              <Link href={`/products/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary">
                    {item.name}
                  </Link>
                  {item.variantLabel && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.variantLabel}</p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-border">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                      disabled={item.quantity >= item.stockQuantity}
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Remove item"
                onClick={() => removeItem(item.variantId)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal())}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Tax (GST)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          </div>
          <div className="border-t border-border/60 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button asChild size="lg" className="w-full rounded-full">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
