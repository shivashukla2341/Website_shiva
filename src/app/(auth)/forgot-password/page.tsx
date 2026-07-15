"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction, type AuthActionResult } from "@/lib/auth/actions";

const initialState: AuthActionResult = {};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, initialState);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      {state.success ? (
        <p className="mt-6 rounded-xl bg-muted p-4 text-sm text-foreground">{state.success}</p>
      ) : (
        <form action={formAction} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" className="w-full rounded-full" disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
      )}

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-3.5" /> Back to sign in
      </Link>
    </div>
  );
}
