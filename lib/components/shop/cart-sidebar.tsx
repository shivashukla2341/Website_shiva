"use client";

// =============================================================================
// NEXCART — CART SIDEBAR
// Slide-in cart with items, quantity control, coupons, totals
// =============================================================================

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Tag,
  ArrowRight,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? "₹";

export function CartSidebar() {
  const {
    items,
    isOpen,
    setOpen,
    removeItem,
    updateQuantity,
    subtotal,
    couponDiscount,
    shippingCharge,
    tax,
    total,
    couponCode,
    setCouponCode,
    applyCoupon,
    removeCoupon,
    coupon,
    itemCount,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await fetch(`/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        applyCoupon(data.data);
        setCouponInput("");
      } else {
        toast.error(data.error ?? "Invalid coupon code");
      }
    } catch {
      toast.error("Failed to apply coupon. Please try again.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold">
                  Your Cart
                  {itemCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {itemCount}
                    </Badge>
                  )}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <PackageOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Your cart is empty</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add some products to get started!
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium gradient-bg text-white hover:opacity-90 mt-4"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <ScrollArea className="flex-1 px-5">
                  <div className="space-y-4 py-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3"
                      >
                        {/* Image */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                          {item.product?.images?.[0]?.url ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <ShoppingBag className="h-8 w-8" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-1 flex-col gap-1 min-w-0">
                          <Link
                            href={`/products/${item.product?.slug}`}
                            onClick={() => setOpen(false)}
                            className="line-clamp-2 text-sm font-medium hover:text-primary transition-colors"
                          >
                            {item.product?.name}
                          </Link>
                          {item.variant && (
                            <p className="text-xs text-muted-foreground">
                              {Object.values(item.variant.options).join(" / ")}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm font-bold text-primary">
                              {CURRENCY}{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                            {/* Quantity */}
                            <div className="flex items-center gap-1">
                              <button
                                className="quantity-btn"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.variantId,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                className="quantity-btn"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.variantId,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="self-start text-muted-foreground hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Coupon */}
                <div className="px-5 py-3 border-t border-border">
                  {coupon ? (
                    <div className="flex items-center justify-between rounded-lg bg-success-light px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">
                          {coupon.code} applied
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="h-9 text-sm uppercase"
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 shrink-0"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="px-5 py-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{CURRENCY}{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Coupon discount</span>
                      <span className="text-success">-{CURRENCY}{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCharge === 0 ? "text-success" : ""}>
                      {shippingCharge === 0 ? "FREE" : `${CURRENCY}${shippingCharge}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary text-lg">
                      {CURRENCY}{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    (incl. GST ₹{tax.toFixed(2)})
                  </p>
                </div>

                {/* CTA */}
                <div className="px-5 pb-6 space-y-2">
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-medium gradient-bg text-white hover:opacity-90"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted hover:text-foreground"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
