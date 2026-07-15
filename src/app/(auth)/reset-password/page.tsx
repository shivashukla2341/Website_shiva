"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction, type AuthActionResult } from "@/lib/auth/actions";

const initialState: AuthActionResult = {};

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Choose a strong password you haven&apos;t used before.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        {state.error && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" className="w-full rounded-full" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Update Password
        </Button>
      </form>
    </div>
  );
}
