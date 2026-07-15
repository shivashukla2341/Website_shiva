"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { signUpAction, type AuthActionResult } from "@/lib/auth/actions";

const initialState: AuthActionResult = {};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  if (state.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">{state.success}</p>
        <Button asChild className="mt-6 w-full rounded-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Join thousands of shoppers getting the best deals first.
      </p>

      <div className="mt-6">
        <OAuthButtons />
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" autoComplete="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <p className="text-xs text-muted-foreground">
            At least 8 characters, with upper &amp; lowercase letters and a number.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="marketingOptIn" name="marketingOptIn" defaultChecked />
          <Label htmlFor="marketingOptIn" className="text-xs font-normal text-muted-foreground">
            Send me deals, offers and product updates.
          </Label>
        </div>

        {state.error && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" className="w-full rounded-full" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Create Account
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
