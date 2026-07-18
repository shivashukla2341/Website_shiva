// =============================================================================
// NEXCART — API UTILITIES
// Shared helpers for API route handlers
// =============================================================================

import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types";

// ─── Response Helpers ────────────────────────────────────────────────────────

export function successResponse<T>(
  data: T,
  message?: string,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function errorResponse(
  error: string,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export function createdResponse<T>(
  data: T,
  message = "Created successfully"
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, 201);
}

export function notFoundResponse(resource = "Resource"): NextResponse<ApiResponse> {
  return errorResponse(`${resource} not found`, 404);
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Forbidden"): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

export function serverErrorResponse(
  error?: unknown
): NextResponse<ApiResponse> {
  console.error("[API Error]:", error);
  const message =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : "Internal server error";
  return errorResponse(message, 500);
}

// ─── Validation Helper ───────────────────────────────────────────────────────

export async function validateBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse<ApiResponse> }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data };
  } catch (error: any) {
    if (error instanceof ZodError) {
      const message = (error as any).errors
        .map((e: any) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return { error: errorResponse(`Validation error: ${message}`, 422) };
    }
    if (error instanceof SyntaxError) {
      return { error: errorResponse("Invalid JSON body", 400) };
    }
    return { error: serverErrorResponse(error) };
  }
}

export function validateQuery<T>(
  params: URLSearchParams,
  schema: ZodSchema<T>
): { data: T } | { error: NextResponse<ApiResponse> } {
  try {
    const rawParams = Object.fromEntries(params.entries());
    const data = schema.parse(rawParams);
    return { data };
  } catch (error: any) {
    if (error instanceof ZodError) {
      const message = (error as any).errors
        .map((e: any) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return { error: errorResponse(`Invalid query params: ${message}`, 422) };
    }
    return { error: serverErrorResponse(error) };
  }
}

// ─── Auth Helpers ────────────────────────────────────────────────────────────

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function requireAuthUser() {
  const user = await getAuthUser();
  if (!user) return { error: unauthorizedResponse() };
  return { user };
}

export async function requireAdminUser() {
  const user = await getAuthUser();
  if (!user) return { error: unauthorizedResponse() };

  const role = user.user_metadata?.role;
  if (role !== "admin" && role !== "super_admin") {
    return { error: forbiddenResponse("Admin access required") };
  }

  return { user };
}

// ─── Pagination Helper ───────────────────────────────────────────────────────

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20"))
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// ─── Error Boundary for API Routes ──────────────────────────────────────────

export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        return unauthorizedResponse();
      }
      return serverErrorResponse(error);
    }
  };
}

// ─── CORS Headers ───────────────────────────────────────────────────────────

export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// ─── Format Currency ─────────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Slug Generator ──────────────────────────────────────────────────────────

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
