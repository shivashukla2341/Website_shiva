import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function apiSuccess<T>(data: T, init?: number | ResponseInit) {
  return NextResponse.json({ success: true, data }, typeof init === "number" ? { status: init } : init);
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiValidationError(error: ZodError) {
  return apiError(error.issues[0]?.message ?? "Invalid request", 422);
}
