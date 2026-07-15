"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductDetailVariant } from "@/lib/data/products";

type Props = {
  productId: string;
  productSlug: string;
  productName: string;
  fallbackImage: string;
  variants: ProductDetailVariant[];
};

function groupAttributes(variants: ProductDetailVariant[]) {
  const groups = new Map<
    string,
    { displayName: string; values: Map<string, { value: string; displayValue: string; hexColor: string | null }> }
  >();

  for (const variant of variants) {
    for (const pva of variant.product_variant_attributes) {
      const attr = pva.attribute_values.attributes;
      const group = groups.get(attr.name) ?? { displayName: attr.display_name, values: new Map() };
      group.values.set(pva.attribute_values.id, {
        value: pva.attribute_values.value,
        displayValue: pva.attribute_values.display_value,
        hexColor: pva.attribute_values.hex_color,
      });
      groups.set(attr.name, group);
    }
  }

  return groups;
}

function variantAttributeMap(variant: ProductDetailVariant) {
  const map = new Map<string, string>();
  for (const pva of variant.product_variant_attributes) {
    map.set(pva.attribute_values.attributes.name, pva.attribute_values.id);
  }
  return map;
}

export function ProductBuyBox({ productId, productSlug, productName, fallbackImage, variants }: Props) {
  const router = useRouter();
  const activeVariants = variants.filter((v) => v.is_active);
  const attributeGroups = React.useMemo(() => groupAttributes(activeVariants), [activeVariants]);

  const initialVariant = activeVariants.find((v) => v.is_default) ?? activeVariants[0];
  const [selected, setSelected] = React.useState<Map<string, string>>(
    initialVariant ? variantAttributeMap(initialVariant) : new Map()
  );
  const [quantity, setQuantity] = React.useState(1);

  const selectedVariant = React.useMemo(() => {
    return (
      activeVariants.find((v) => {
        const map = variantAttributeMap(v);
        if (map.size !== selected.size) return false;
        for (const [key, value] of selected) {
          if (map.get(key) !== value) return false;
        }
        return true;
      }) ?? initialVariant
    );
  }, [activeVariants, selected, initialVariant]);

  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const inWishlist = has(productId);

  if (!selectedVariant) {
    return <p className="text-sm text-muted-foreground">This product is currently unavailable.</p>;
  }

  const inStock = selectedVariant.stock_quantity > 0;
  const discount = formatDiscountPercent(selectedVariant.price, selectedVariant.compare_at_price);

  function buildCartItem() {
    return {
      variantId: selectedVariant!.id,
      productId,
      slug: productSlug,
      name: productName,
      variantLabel: Array.from(selected.values())
        .map((id) => {
          for (const group of attributeGroups.values()) {
            const v = group.values.get(id);
            if (v) return v.displayValue;
          }
          return null;
        })
        .filter(Boolean)
        .join(" / "),
      image: selectedVariant!.image_url ?? fallbackImage,
      price: selectedVariant!.price,
      quantity,
      stockQuantity: selectedVariant!.stock_quantity,
    };
  }

  function handleAddToCart() {
    addItem(buildCartItem());
    toast.success("Added to cart");
  }

  function handleBuyNow() {
    addItem(buildCartItem());
    router.push("/checkout");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatCurrency(selectedVariant.price)}</span>
        {selectedVariant.compare_at_price && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatCurrency(selectedVariant.compare_at_price)}
            </span>
            {discount && (
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {discount}% off
              </span>
            )}
          </>
        )}
      </div>

      {Array.from(attributeGroups.entries()).map(([attrName, group]) => (
        <div key={attrName}>
          <p className="mb-2 text-sm font-semibold">{group.displayName}</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(group.values.entries()).map(([valueId, value]) => {
              const isSelected = selected.get(attrName) === valueId;
              if (value.hexColor) {
                return (
                  <button
                    key={valueId}
                    type="button"
                    title={value.displayValue}
                    onClick={() => setSelected(new Map(selected).set(attrName, valueId))}
                    className={cn(
                      "size-9 rounded-full border-2 transition-all",
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-border"
                    )}
                    style={{ backgroundColor: value.hexColor }}
                  />
                );
              }
              return (
                <button
                  key={valueId}
                  type="button"
                  onClick={() => setSelected(new Map(selected).set(attrName, valueId))}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {value.displayValue}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <p className="mb-2 text-sm font-semibold">Quantity</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-border">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className="size-3.5" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              disabled={quantity >= selectedVariant.stock_quantity}
              onClick={() => setQuantity((q) => Math.min(selectedVariant.stock_quantity, q + 1))}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              inStock ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
            )}
          >
            {inStock
              ? selectedVariant.stock_quantity <= 5
                ? `Only ${selectedVariant.stock_quantity} left`
                : "In Stock"
              : "Out of Stock"}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 rounded-full"
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="size-4" /> Add to Cart
        </Button>
        <Button size="lg" className="flex-1 rounded-full" disabled={!inStock} onClick={handleBuyNow}>
          <Zap className="size-4" /> Buy Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full"
          aria-label="Toggle wishlist"
          onClick={() =>
            toggle({ productId, slug: productSlug, name: productName, image: fallbackImage, price: selectedVariant.price })
          }
        >
          <Heart className={cn("size-4", inWishlist && "fill-destructive text-destructive")} />
        </Button>
      </div>

      <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck className="size-4" /> Free delivery in 3-5 business days
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ShieldCheck className="size-4" /> 7-day easy returns &middot; Secure checkout
        </div>
      </div>
    </div>
  );
}
