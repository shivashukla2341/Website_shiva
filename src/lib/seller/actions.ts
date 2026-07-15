"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/security/authorize";
import { sellerApplicationSchema } from "@/lib/validations/seller";

export type SellerActionResult = { error?: string; success?: string };

export async function applyAsSellerAction(
  _prev: SellerActionResult,
  formData: FormData
): Promise<SellerActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in to apply as a seller." };

  const parsed = sellerApplicationSchema.safeParse({
    businessName: formData.get("businessName"),
    gstin: formData.get("gstin"),
    supportEmail: formData.get("supportEmail"),
    supportPhone: formData.get("supportPhone"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("sellers").insert({
    user_id: user.id,
    business_name: parsed.data.businessName,
    gstin: parsed.data.gstin || null,
    support_email: parsed.data.supportEmail,
    support_phone: parsed.data.supportPhone,
  });

  if (error) {
    if (error.code === "23505") return { error: "You've already submitted a seller application." };
    return { error: error.message };
  }
  return { success: "Application submitted! We'll review it and get back to you within 2-3 business days." };
}
