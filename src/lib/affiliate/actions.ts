"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/security/authorize";

export type AffiliateActionResult = { error?: string; success?: string; code?: string };

function generateAffiliateCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function joinAffiliateProgramAction(): Promise<AffiliateActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in to join the affiliate program." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("affiliates")
    .select("code")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return { success: "You're already part of the affiliate program.", code: existing.code };

  const { data, error } = await supabase
    .from("affiliates")
    .insert({ user_id: user.id, code: generateAffiliateCode() })
    .select("code")
    .single();

  if (error) return { error: error.message };
  return { success: "You're in! Your application is pending approval.", code: data.code };
}
