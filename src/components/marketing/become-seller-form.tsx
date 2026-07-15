"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applyAsSellerAction, type SellerActionResult } from "@/lib/seller/actions";

const initialState: SellerActionResult = {};

export function BecomeSellerForm() {
  const [state, formAction, isPending] = useActionState(applyAsSellerAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft">
        <p className="font-medium">{state.success}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
      <div className="space-y-1.5">
        <Label htmlFor="businessName">Business name</Label>
        <Input id="businessName" name="businessName" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="supportEmail">Business email</Label>
          <Input id="supportEmail" name="supportEmail" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="supportPhone">Business phone</Label>
          <Input id="supportPhone" name="supportPhone" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="gstin">GSTIN (optional)</Label>
        <Input id="gstin" name="gstin" placeholder="15-character GST number" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="w-full rounded-full" disabled={isPending}>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        Submit Application
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        You&apos;ll need to be signed in — we&apos;ll prompt you to log in if needed.
      </p>
    </form>
  );
}
