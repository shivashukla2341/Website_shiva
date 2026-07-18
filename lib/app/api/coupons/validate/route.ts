// =============================================================================
// NEXCART — COUPON VALIDATION API
// POST /api/coupons/validate
// =============================================================================

import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, serverErrorResponse, validateBody, withErrorHandling, requireAuthUser } from "@/lib/api/helpers";
import { applyRateLimit, rateLimiters } from "@/lib/rate-limit";

const validateCouponSchema = z.object({
  code: z.string().min(1).toUpperCase(),
  subtotal: z.coerce.number().positive(),
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const limited = await applyRateLimit(request, rateLimiters.api);
  if (limited) return limited;

  const { error: authError, user } = await requireAuthUser();
  if (authError) return authError;

  const validation = await validateBody(request, validateCouponSchema);
  if ("error" in validation) return validation.error;

  const { data } = validation;
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", data.code)
    .eq("is_active", true)
    .lte("starts_at", now)
    .single();

  if (error || !coupon) return errorResponse("Invalid or expired coupon code", 400);

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return errorResponse("This coupon has expired", 400);
  }

  // Min order check
  if (coupon.min_order_amount && data.subtotal < coupon.min_order_amount) {
    return errorResponse(`Minimum order amount of ₹${coupon.min_order_amount} required`, 400);
  }

  // Usage limit
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return errorResponse("This coupon has reached its usage limit", 400);
  }

  // Per-user limit
  if (coupon.usage_limit_per_user) {
    const { count } = await supabase
      .from("coupon_usage")
      .select("*", { count: "exact", head: true })
      .eq("coupon_id", coupon.id)
      .eq("user_id", user!.id);
    if ((count ?? 0) >= coupon.usage_limit_per_user) {
      return errorResponse("You've already used this coupon the maximum number of times", 400);
    }
  }

  return successResponse({
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    maxDiscountAmount: coupon.max_discount_amount,
    description: coupon.description,
  }, "Coupon applied successfully!");
});
