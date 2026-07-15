"use client";

import * as React from "react";
import Image from "next/image";
import { PlayCircle, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";

type MediaItem = { id: string; url: string; media_type: string; alt_text: string | null };

export function ProductGallery({ media, productName }: { media: MediaItem[]; productName: string }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = media[activeIndex] ?? media[0];

  if (!active) {
    return <div className="aspect-square rounded-2xl bg-muted" />;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-soft">
        <div className="group relative aspect-square">
          {active.media_type === "video" ? (
            <video src={active.url} controls className="size-full object-cover" />
          ) : (
            <Image
              src={active.url}
              alt={active.alt_text ?? productName}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          )}
          {active.media_type === "360" && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow-soft">
              <RotateCw className="size-3.5" /> 360&deg; View
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-y-auto">
        {media.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition-colors sm:size-20",
              i === activeIndex ? "border-primary" : "border-transparent hover:border-border"
            )}
          >
            {item.media_type === "video" ? (
              <div className="flex size-full items-center justify-center bg-muted">
                <PlayCircle className="size-6 text-muted-foreground" />
              </div>
            ) : (
              <Image src={item.url} alt="" fill sizes="80px" className="object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
