"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-9 text-destructive" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <div className="mt-8 flex gap-3">
        <Button variant="outline" className="rounded-full" onClick={() => reset()}>
          Try Again
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
