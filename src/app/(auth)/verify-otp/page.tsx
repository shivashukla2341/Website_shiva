import { Suspense } from "react";

import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
}
