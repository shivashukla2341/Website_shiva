// =============================================================================
// NEXCART — AUTH MIDDLEWARE
// Protects routes and refreshes Supabase session tokens.
// =============================================================================

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// ─── Protected Routes ───────────────────────────────────────────────────────
// Patterns that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/checkout",
  "/wishlist",
  "/orders",
  "/profile",
  "/settings",
  "/notifications",
  "/support",
  "/addresses",
];

// Admin-only routes
const ADMIN_ROUTES = ["/admin"];

// Auth routes (redirect to dashboard if already logged in)
const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session (critical for SSR auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Redirect unauthenticated users away from protected routes ────────────
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isProtected && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // ── Admin route protection ───────────────────────────────────────────────
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isAdminRoute) {
    if (!user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin role via metadata
    const role = user.user_metadata?.role;
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  // ── Redirect authenticated users away from auth pages ───────────────────
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && user) {
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    return NextResponse.redirect(
      new URL(redirectTo || "/dashboard", request.url)
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     * - API routes we handle auth in manually
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
