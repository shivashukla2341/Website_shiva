// =============================================================================
// NEXCART — ZUSTAND CART STORE
// =============================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { CartItem, Product, ProductVariant, Coupon } from "@/types";
import { toast } from "sonner";

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  couponCode: string;
  isOpen: boolean;

  // Computed
  itemCount: number;
  subtotal: number;
  discount: number;
  couponDiscount: number;
  shippingCharge: number;
  tax: number;
  total: number;

  // Actions
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  setCouponCode: (code: string) => void;
}

const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 499);
const DEFAULT_SHIPPING = Number(process.env.NEXT_PUBLIC_DEFAULT_SHIPPING_CHARGE ?? 49);
const TAX_RATE = Number(process.env.NEXT_PUBLIC_DEFAULT_TAX_RATE ?? 18);

function calculateCart(items: CartItem[], coupon: Coupon | null) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let couponDiscount = 0;
  if (coupon) {
    if (coupon.type === "percentage") {
      couponDiscount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscountAmount) {
        couponDiscount = Math.min(couponDiscount, coupon.maxDiscountAmount);
      }
    } else if (coupon.type === "fixed_amount") {
      couponDiscount = Math.min(coupon.value, subtotal);
    }
  }

  const discountedSubtotal = subtotal - couponDiscount;
  const shippingCharge =
    coupon?.type === "free_shipping" || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : DEFAULT_SHIPPING;
  const tax = (discountedSubtotal * TAX_RATE) / 118; // Extract from inclusive price
  const total = discountedSubtotal + shippingCharge;

  return { subtotal, couponDiscount, shippingCharge, tax, total };
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items: [],
      coupon: null,
      couponCode: "",
      isOpen: false,
      itemCount: 0,
      subtotal: 0,
      discount: 0,
      couponDiscount: 0,
      shippingCharge: 0,
      tax: 0,
      total: 0,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              item.variantId === (variant?.id ?? undefined)
          );

          const price = variant?.price ?? product.price;

          if (existingIndex >= 0) {
            state.items[existingIndex].quantity += quantity;
          } else {
            state.items.push({
              id: `${product.id}-${variant?.id ?? "default"}-${Date.now()}`,
              cartId: "local",
              productId: product.id,
              product,
              variantId: variant?.id,
              variant,
              quantity,
              price,
              addedAt: new Date().toISOString(),
            });
          }

          const { subtotal, couponDiscount, shippingCharge, tax, total } =
            calculateCart(state.items, state.coupon);

          state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
          state.subtotal = subtotal;
          state.couponDiscount = couponDiscount;
          state.shippingCharge = shippingCharge;
          state.tax = tax;
          state.total = total;
        });

        toast.success("Added to cart!", {
          description: `${product.name}${variant ? ` — ${variant.name}` : ""}`,
          action: {
            label: "View Cart",
            onClick: () => get().setOpen(true),
          },
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => {
          state.items = state.items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          );

          const { subtotal, couponDiscount, shippingCharge, tax, total } =
            calculateCart(state.items, state.coupon);

          state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
          state.subtotal = subtotal;
          state.couponDiscount = couponDiscount;
          state.shippingCharge = shippingCharge;
          state.tax = tax;
          state.total = total;
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            state.items = state.items.filter(
              (item) =>
                !(item.productId === productId && item.variantId === variantId)
            );
          } else {
            const item = state.items.find(
              (i) => i.productId === productId && i.variantId === variantId
            );
            if (item) item.quantity = quantity;
          }

          const { subtotal, couponDiscount, shippingCharge, tax, total } =
            calculateCart(state.items, state.coupon);

          state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
          state.subtotal = subtotal;
          state.couponDiscount = couponDiscount;
          state.shippingCharge = shippingCharge;
          state.tax = tax;
          state.total = total;
        });
      },

      clearCart: () => {
        set((state) => {
          state.items = [];
          state.coupon = null;
          state.couponCode = "";
          state.itemCount = 0;
          state.subtotal = 0;
          state.discount = 0;
          state.couponDiscount = 0;
          state.shippingCharge = 0;
          state.tax = 0;
          state.total = 0;
        });
      },

      setOpen: (open) => {
        set((state) => {
          state.isOpen = open;
        });
      },

      applyCoupon: (coupon) => {
        set((state) => {
          state.coupon = coupon;
          state.couponCode = coupon.code;

          const { subtotal, couponDiscount, shippingCharge, tax, total } =
            calculateCart(state.items, coupon);

          state.subtotal = subtotal;
          state.couponDiscount = couponDiscount;
          state.shippingCharge = shippingCharge;
          state.tax = tax;
          state.total = total;
        });

        toast.success(`Coupon "${coupon.code}" applied!`, {
          description: `You saved ₹${calculateCart(get().items, coupon).couponDiscount.toFixed(2)}`,
        });
      },

      removeCoupon: () => {
        set((state) => {
          state.coupon = null;
          state.couponCode = "";

          const { subtotal, shippingCharge, tax, total } =
            calculateCart(state.items, null);

          state.subtotal = subtotal;
          state.couponDiscount = 0;
          state.shippingCharge = shippingCharge;
          state.tax = tax;
          state.total = total;
        });
      },

      setCouponCode: (code) => {
        set((state) => {
          state.couponCode = code;
        });
      },
    })),
    {
      name: "nexcart-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        couponCode: state.couponCode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { subtotal, couponDiscount, shippingCharge, tax, total } =
            calculateCart(state.items, state.coupon);
          state.itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
          state.subtotal = subtotal;
          state.couponDiscount = couponDiscount;
          state.shippingCharge = shippingCharge;
          state.tax = tax;
          state.total = total;
        }
      },
    }
  )
);
