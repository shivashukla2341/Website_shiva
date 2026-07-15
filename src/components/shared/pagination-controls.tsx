import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function PaginationControls({
  page,
  totalPages,
  basePath,
  searchParams,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted",
          page === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((p, i) => (
        <React.Fragment key={p}>
          {i > 0 && pages[i - 1] !== p - 1 && (
            <span className="px-1 text-sm text-muted-foreground">…</span>
          )}
          <Link
            href={hrefFor(p)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors hover:bg-muted",
              p === page && "bg-primary text-primary-foreground hover:bg-primary"
            )}
          >
            {p}
          </Link>
        </React.Fragment>
      ))}

      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted",
          page === totalPages && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
