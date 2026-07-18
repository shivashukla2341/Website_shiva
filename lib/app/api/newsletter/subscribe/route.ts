// =============================================================================
// NEXCART — NEWSLETTER SUBSCRIPTION API
// POST /api/newsletter/subscribe
// =============================================================================

import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { successResponse, serverErrorResponse, validateBody, withErrorHandling, errorResponse } from "@/lib/api/helpers";
import { newsletterSchema } from "@/lib/validators";
import { applyRateLimit, rateLimiters } from "@/lib/rate-limit";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const limited = await applyRateLimit(request, rateLimiters.email);
  if (limited) return limited;

  const validation = await validateBody(request, newsletterSchema);
  if ("error" in validation) return validation.error;

  const { data } = validation;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email: data.email, name: data.name, is_active: true }, { onConflict: "email" });

  if (error) return serverErrorResponse(error);

  return successResponse(null, "Successfully subscribed!");
});
