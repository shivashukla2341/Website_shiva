import "server-only";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

type Role = Enums<"user_role">;

/** Returns the current user, or null if not authenticated. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Redirects to /login if there's no authenticated user. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Loads the current user's profile row (role, name, etc.), or null. */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

/**
 * Redirects unless the current user has one of the given roles. This is
 * defense-in-depth alongside RLS — Postgres policies are the source of
 * truth, this just gives a clean redirect instead of a data-layer error.
 */
export async function requireRole(...roles: Role[]) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!roles.includes(profile.role)) redirect("/");
  return profile;
}
