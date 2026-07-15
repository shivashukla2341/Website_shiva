"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyOtpSchema,
} from "@/lib/validations/auth";

export type AuthActionResult = { error?: string; success?: string };

async function getSiteUrl() {
  const h = await headers();
  const origin = h.get("origin");
  return origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signUpAction(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    marketingOptIn: formData.get("marketingOptIn") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl}/callback`,
    },
  });

  if (error) return { error: error.message };
  return { success: "Check your inbox to confirm your email address." };
}

export async function signInAction(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Invalid email or password" };

  const redirectTo = formData.get("redirectTo");
  redirect(typeof redirectTo === "string" && redirectTo ? redirectTo : "/account");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInWithOAuthAction(provider: "google" | "github") {
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${siteUrl}/callback` },
  });
  if (error || !data.url) redirect("/login?error=oauth_failed");
  redirect(data.url);
}

export async function requestPasswordResetAction(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  // Always return success even if the email doesn't exist, to avoid leaking
  // which addresses have accounts.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/reset-password`,
  });
  return { success: "If an account exists for that email, a reset link is on its way." };
}

export async function resetPasswordAction(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  redirect("/login?reset=success");
}

export async function verifyOtpAction(
  _prev: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const parsed = verifyOtpSchema.safeParse({
    email: formData.get("email"),
    token: formData.get("token"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "email",
  });
  if (error) return { error: "Invalid or expired code" };

  redirect("/account");
}

export async function resendOtpAction(email: string): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) return { error: error.message };
  return { success: "A new code has been sent." };
}
