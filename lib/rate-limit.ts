// =============================================================================
// NEXCART — RATE LIMITER (Upstash Redis)
// =============================================================================

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { errorResponse } from "@/lib/api/helpers";

// ─── Redis Client ────────────────────────────────────────────────────────────

function getRedis() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// ─── Rate Limiter Presets ────────────────────────────────────────────────────

export function createRateLimiter(
  requests: number,
  windowSeconds: number
): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds}s`),
    analytics: true,
    prefix: "nexcart_rl",
  });
}

// Common presets
export const rateLimiters = {
  /** Auth endpoints: 5 req/minute */
  auth: createRateLimiter(5, 60),
  /** General API: 60 req/minute */
  api: createRateLimiter(60, 60),
  /** Search: 30 req/minute */
  search: createRateLimiter(30, 60),
  /** Payment: 10 req/minute */
  payment: createRateLimiter(10, 60),
  /** Email/OTP: 3 req/5 minutes */
  email: createRateLimiter(3, 300),
  /** Admin: 120 req/minute */
  admin: createRateLimiter(120, 60),
};

// ─── Apply Rate Limit ────────────────────────────────────────────────────────

export async function applyRateLimit(
  request: NextRequest,
  limiter: Ratelimit | null,
  identifier?: string
) {
  if (!limiter) return null; // No Redis configured — skip

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const key = identifier ? `${identifier}:${ip}` : ip;
  const { success, limit, remaining, reset } = await limiter.limit(key);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return errorResponse(
      `Too many requests. Please try again in ${retryAfter} seconds.`,
      429
    );
  }

  return null; // Allowed
}
