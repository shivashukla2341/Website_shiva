import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database";

const PROTECTED_PREFIXES = ["/account", "/checkout"];
const ADMIN_PREFIX = "/admin";
const AUTH_PREFIXES = ["/login", "/signup", "/forgot-password", "/reset-password"];

/**
 * Refreshes the Supabase session cookie on every request and enforces
 * route-level auth. Called from the root src/proxy.ts (Next.js 16 renamed
 * `middleware.ts` to `proxy.ts`).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdmin = pathname.startsWith(ADMIN_PREFIX);
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if ((isProtected || isAdmin) && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdmin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "support"].includes(profile.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return response;
}
