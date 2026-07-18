// =============================================================================
// NEXCART — ZUSTAND WISHLIST STORE
// =============================================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/types";
import { toast } from "sonner";

interface WishlistState {
  items: Product[];
  productIds: Set<string>;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      productIds: new Set<string>(),

      addItem: (product) => {
        if (get().productIds.has(product.id)) return;
        set((state) => ({
          items: [...state.items, product],
          productIds: new Set([...state.productIds, product.id]),
        }));
        toast.success("Added to wishlist", {
          description: product.name,
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newIds = new Set(state.productIds);
          newIds.delete(productId);
          return {
            items: state.items.filter((p) => p.id !== productId),
            productIds: newIds,
          };
        });
      },

      toggleItem: (product) => {
        const { productIds, addItem, removeItem } = get();
        if (productIds.has(product.id)) {
          removeItem(product.id);
          toast.info("Removed from wishlist");
        } else {
          addItem(product);
        }
      },

      isInWishlist: (productId) => get().productIds.has(productId),

      clearWishlist: () => set({ items: [], productIds: new Set() }),
    }),
    {
      name: "nexcart-wishlist",
      storage: createJSONStorage(() => localStorage),
      // Serialize Set properly
      partialize: (state) => ({
        items: state.items,
        productIds: [...state.productIds],
      }),
      merge: (persistedState: unknown, currentState) => {
        const persisted = persistedState as { items: Product[]; productIds: string[] };
        return {
          ...currentState,
          items: persisted.items ?? [],
          productIds: new Set(persisted.productIds ?? []),
        };
      },
    }
  )
);
