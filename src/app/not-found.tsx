import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-9 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/category">Browse Products</Link>
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
