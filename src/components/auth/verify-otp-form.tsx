"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { resendOtpAction, verifyOtpAction, type AuthActionResult } from "@/lib/auth/actions";

const initialState: AuthActionResult = {};

export function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [otp, setOtp] = React.useState("");
  const [state, formAction, isPending] = useActionState(verifyOtpAction, initialState);
  const [resendState, setResendState] = React.useState<AuthActionResult>({});

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter the 6-digit code we sent to <span className="font-medium">{email || "your email"}</span>.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={otp} />
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {state.error && <p className="text-center text-sm text-destructive">{state.error}</p>}

        <Button type="submit" className="w-full rounded-full" disabled={isPending || otp.length < 6}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Verify
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Didn&apos;t get a code?{" "}
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          onClick={async () => setResendState(await resendOtpAction(email))}
        >
          Resend
        </button>
      </p>
      {resendState.success && (
        <p className="mt-2 text-center text-xs text-muted-foreground">{resendState.success}</p>
      )}
    </div>
  );
}
