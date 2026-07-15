"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "relevance", label: "Best Match" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export function ProductFilters({ maxPrice = 200000 }: { maxPrice?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [price, setPrice] = React.useState<[number, number]>([
    Number(searchParams.get("minPrice") ?? 0),
    Number(searchParams.get("maxPrice") ?? maxPrice),
  ]);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyPrice() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(price[0]));
    params.set("maxPrice", String(price[1]));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeRating = searchParams.get("minRating");

  return (
    <div className="space-y-6 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
      <div>
        <label className="text-sm font-semibold">Sort by</label>
        <NativeSelect
          className="mt-2 w-full"
          value={searchParams.get("sort") ?? "relevance"}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <NativeSelectOption key={opt.value} value={opt.value}>
              {opt.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div>
        <label className="text-sm font-semibold">Price range</label>
        <div className="mt-3 px-1">
          <Slider
            value={price}
            min={0}
            max={maxPrice}
            step={500}
            onValueChange={(v) => setPrice(v as [number, number])}
            onValueCommit={applyPrice}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>₹{price[0].toLocaleString("en-IN")}</span>
          <span>₹{price[1].toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Minimum rating</label>
        <div className="mt-2 flex flex-col gap-1">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => updateParam("minRating", activeRating === String(rating) ? null : String(rating))}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                activeRating === String(rating) && "bg-primary/10 text-primary"
              )}
            >
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-muted-foreground">&amp; up</span>
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full rounded-full"
        onClick={() => router.push(pathname)}
      >
        Clear Filters
      </Button>
    </div>
  );
}
