import { CheckCircle2, Star } from "lucide-react";

import type { ProductReview } from "@/lib/data/products";

export function ReviewsSection({
  reviews,
  avgRating,
  reviewCount,
}: {
  reviews: ProductReview[];
  avgRating: number;
  reviewCount: number;
}) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div>
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-6 shadow-soft sm:w-56">
          <span className="text-4xl font-bold">{avgRating.toFixed(1)}</span>
          <div className="mt-1 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < Math.round(avgRating)
                    ? "size-4 fill-amber-400 text-amber-400"
                    : "size-4 text-muted-foreground/30"
                }
              />
            ))}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{reviewCount.toLocaleString("en-IN")} ratings</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {distribution.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-10 text-muted-foreground">{star} star</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                />
              </div>
              <span className="w-8 text-right text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product.</p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border/60 pb-6 last:border-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < review.rating
                        ? "size-3.5 fill-amber-400 text-amber-400"
                        : "size-3.5 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>
              {review.is_verified_purchase && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" /> Verified Purchase
                </span>
              )}
            </div>
            {review.title && <p className="mt-2 font-semibold">{review.title}</p>}
            {review.body && <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>}
            <p className="mt-2 text-xs text-muted-foreground">
              {review.profiles?.full_name ?? "Anonymous"} &middot;{" "}
              {new Date(review.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
