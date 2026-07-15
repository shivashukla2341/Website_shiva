"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/security/authorize";
import { addressSchema, updateProfileSchema } from "@/lib/validations/account";
import { changePasswordSchema } from "@/lib/validations/auth";

export type ActionResult = { error?: string; success?: string };

export async function updateProfileAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = updateProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      date_of_birth: parsed.data.dateOfBirth || null,
      gender: parsed.data.gender ?? null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/profile");
  return { success: "Profile updated." };
}

export async function changePasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Not authenticated" };

  // Re-authenticate with the current password before allowing a change.
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: parsed.data.currentPassword,
  });
  if (reauthError) return { error: "Current password is incorrect" };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
  if (error) return { error: error.message };
  return { success: "Password updated." };
}

export async function addAddressAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = addressSchema.safeParse({
    type: formData.get("type") || "shipping",
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    line1: formData.get("line1"),
    line2: formData.get("line2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "IN",
    landmark: formData.get("landmark"),
    isDefault: formData.get("isDefault") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    type: parsed.data.type,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    city: parsed.data.city,
    state: parsed.data.state,
    postal_code: parsed.data.postalCode,
    country: parsed.data.country,
    landmark: parsed.data.landmark || null,
    is_default: parsed.data.isDefault,
  });

  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  return { success: "Address added." };
}

export async function deleteAddressAction(addressId: string): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  return { success: "Address removed." };
}

export async function setDefaultAddressAction(
  addressId: string,
  type: "shipping" | "billing"
): Promise<ActionResult> {
  const user = await requireUser();
  const supabase = await createClient();

  // Clear the existing default for this type, then set the new one — RLS
  // scopes both statements to the current user.
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", user.id)
    .eq("type", type);

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  return { success: "Default address updated." };
}
