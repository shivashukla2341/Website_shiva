"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { joinAffiliateProgramAction } from "@/lib/affiliate/actions";

export function JoinAffiliateButton() {
  const [isPending, startTransition] = React.useTransition();
  const [code, setCode] = React.useState<string | null>(null);

  function handleClick() {
    startTransition(async () => {
      const result = await joinAffiliateProgramAction();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (result.success) toast.success(result.success);
      if (result.code) setCode(result.code);
    });
  }

  if (code) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-5 text-center shadow-soft">
        <p className="text-sm text-muted-foreground">Your referral code</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-widest">{code}</p>
      </div>
    );
  }

  return (
    <Button size="lg" className="rounded-full" disabled={isPending} onClick={handleClick}>
      {isPending && <Loader2 className="size-4 animate-spin" />}
      Join the Affiliate Program
    </Button>
  );
}
