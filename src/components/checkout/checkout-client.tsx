"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AddAddressDialog } from "@/components/account/add-address-dialog";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { Tables } from "@/types/database";

export function CheckoutClient({ addresses }: { addresses: Tables<"addresses">[] }) {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const [selectedAddressId, setSelectedAddressId] = React.useState(
    addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id
  );
  const [isPlacing, setIsPlacing] = React.useState(false);

  const shipping = subtotal() >= 499 ? 0 : 49;
  const tax = Math.round(subtotal() * 0.18);
  const total = subtotal() + shipping + tax;

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    setIsPlacing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Could not place order");
        return;
      }
      clear();
      router.push(`/checkout/success?order=${json.data.orderNumber}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="size-14 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Your cart is empty</h1>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4" /> Delivery Address
            </h2>
            <AddAddressDialog />
          </div>

          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add an address to continue.</p>
          ) : (
            <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
              <div className="space-y-3">
                {addresses.map((address) => (
                  <Label
                    key={address.id}
                    htmlFor={address.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3.5 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                  >
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {address.full_name} &middot; {address.phone}
                      </p>
                      <p className="text-muted-foreground">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                        {address.postal_code}
                      </p>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <h2 className="mb-4 font-semibold">Review Items ({items.length})</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
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
        <div className="flex justify-between border-t border-border/60 pt-3 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <Button
          size="lg"
          className="w-full rounded-full"
          disabled={isPlacing || !selectedAddressId}
          onClick={handlePlaceOrder}
        >
          {isPlacing && <Loader2 className="size-4 animate-spin" />}
          Place Order
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Payment is collected securely on the next step via Razorpay or Stripe.
        </p>
      </div>
    </div>
  );
}
