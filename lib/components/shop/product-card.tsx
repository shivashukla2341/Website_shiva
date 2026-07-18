"use client";

// =============================================================================
// NEXCART — PRODUCT CARD
// Reusable product card with wishlist, add-to-cart, rating, discount badge
// =============================================================================

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  showBadge?: "sale" | "new" | "trending" | "featured" | "best_seller" | null;
  className?: string;
  compact?: boolean;
}

const CURRENCY = "₹";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : i < rating
                ? "fill-yellow-200 text-yellow-400"
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  );
}

export function ProductCard({ product, showBadge, className, compact }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.url;
  const secondaryImage = product.images?.[1]?.url;

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const badge = showBadge || (product.isBestSeller ? "best_seller" : null) || (product.isNewArrival ? "new" : null) || (product.isTrending ? "trending" : null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.hasVariants) {
      // Navigate to product page to select variant
      window.location.href = `/products/${product.slug}`;
      return;
    }
    setIsAddingToCart(true);
    addItem(product);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setIsAddingToCart(false);
    }, 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn("product-card group", className)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && <Skeleton className="absolute inset-0" />}

          {primaryImage ? (
            <>
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  secondaryImage
                    ? "group-hover:opacity-0"
                    : "group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              {secondaryImage && (
                <Image
                  src={secondaryImage}
                  alt={`${product.name} — view 2`}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 opacity-30" />
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div className="absolute left-2.5 top-2.5">
              {badge === "sale" && discountPercent > 0 && (
                <span className="badge-sale">-{discountPercent}%</span>
              )}
              {badge === "new" && (
                <span className="badge-new">New</span>
              )}
              {badge === "trending" && (
                <span className="badge-trending">🔥 Hot</span>
              )}
              {badge === "best_seller" && (
                <span className="badge-featured">⭐ Best</span>
              )}
              {badge === "featured" && (
                <span className="badge-featured">Featured</span>
              )}
            </div>
          )}

          {/* Discount badge top-right */}
          {discountPercent > 0 && badge !== "sale" && (
            <div className="absolute right-2.5 top-2.5">
              <span className="badge-sale">-{discountPercent}%</span>
            </div>
          )}

          {/* Action buttons (visible on hover) */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            {/* Quick View */}
            <Link href={`/products/${product.slug}`} aria-label="View product" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors">
              <Eye className="h-4 w-4" />
            </Link>

            {/* Add to Cart */}
            <Button
              variant="default"
              size="sm"
              className={cn(
                "h-8 rounded-lg text-xs font-semibold shadow-md px-3 transition-all",
                justAdded
                  ? "bg-green-500 hover:bg-green-500"
                  : "gradient-bg hover:opacity-90"
              )}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Added!
                </>
              ) : product.hasVariants ? (
                <>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  Options
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                  Add
                </>
              )}
            </Button>

            {/* Buy Now */}
            <Link href={`/checkout?buyNow=${product.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80">
              <Zap className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className={cn("p-3", compact ? "pb-3" : "pb-4")}>
          {/* Brand */}
          {product.brand && (
            <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {product.brand.name}
            </p>
          )}

          {/* Name */}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {!compact && product.reviewCount > 0 && (
            <div className="mt-1.5">
              <StarRating rating={product.averageRating} count={product.reviewCount} />
            </div>
          )}

          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-base font-bold text-foreground">
              {CURRENCY}{product.price.toLocaleString("en-IN")}
            </span>
            {product.compareAtPrice && (
              <span className="price-original text-sm">
                {CURRENCY}{product.compareAtPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-semibold text-green-600">
                {discountPercent}% off
              </span>
            )}
          </div>

          {/* Free shipping indicator */}
          {product.price >= 499 && (
            <p className="mt-1 text-[11px] text-green-600 font-medium">
              ✓ Free delivery
            </p>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleItem(product);
        }}
        className={cn(
          "absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm transition-all duration-200",
          inWishlist
            ? "text-red-500 border-red-200 bg-red-50"
            : "text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50"
        )}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
      </button>
    </motion.div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

export function ProductCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className={cn("p-3 space-y-2", compact ? "pb-3" : "pb-4")}>
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/2 mt-2" />
      </div>
    </div>
  );
}
