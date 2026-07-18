// =============================================================================
// NEXCART — AI CHAT API
// POST /api/ai/chat
// =============================================================================

import { NextRequest } from "next/server";
import { z } from "zod";
import {
  successResponse,
  serverErrorResponse,
  validateBody,
  withErrorHandling,
} from "@/lib/api/helpers";
import { getAIChatResponse, type ChatMessage } from "@/lib/ai";
import { applyRateLimit, rateLimiters } from "@/lib/rate-limit";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(1000),
      })
    )
    .min(1)
    .max(20),
  context: z
    .object({
      currentPage: z.string().optional(),
      cartItems: z.number().optional(),
    })
    .optional(),
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const limited = await applyRateLimit(request, rateLimiters.api, "ai-chat");
  if (limited) return limited;

  const validation = await validateBody(request, chatSchema);
  if ("error" in validation) return validation.error;

  const { data } = validation;

  const response = await getAIChatResponse(
    data.messages as ChatMessage[],
    data.context
  );

  return successResponse({ message: response });
});
