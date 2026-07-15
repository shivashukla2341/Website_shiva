# Tech Architecture

## 1. System Overview

```
                                   ┌───────────────────────────┐
                                   │        Client (Browser)    │
                                   │  Next.js RSC + Client Isl. │
                                   └──────────────┬─────────────┘
                                                  │ HTTPS
                                                  ▼
                        ┌───────────────────────────────────────────┐
                        │              Vercel Edge Network            │
                        │  • Static assets / ISR cache / Edge MW       │
                        └───────────────────┬───────────────────────┘
                                            │
                     ┌──────────────────────┼──────────────────────┐
                     ▼                      ▼                      ▼
        ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
        │  Next.js Server      │ │  Next.js API Routes  │ │  Middleware          │
        │  Components (RSC)    │ │  (Route Handlers)     │ │  (auth, rate-limit,  │
        │  SSR pages            │ │  REST endpoints        │ │  security headers)  │
        └──────────┬───────────┘ └──────────┬────────────┘ └──────────┬──────────┘
                   │                        │                          │
                   └────────────┬───────────┴──────────────────────────┘
                                ▼
              ┌───────────────────────────────────────────────┐
              │                Service Layer (src/lib)          │
              │  auth · products · orders · cart · payments ·    │
              │  coupons · reviews · ai · email · storage         │
              └───────────────┬───────────────┬──────────────────┘
                              │                │
             ┌────────────────┘                └────────────────┐
             ▼                                                   ▼
┌───────────────────────────┐                     ┌───────────────────────────────┐
│   Supabase                  │                     │   Third-Party Services         │
│  • Postgres (RLS)            │                     │  • Stripe / Razorpay (payments) │
│  • Auth (email, OAuth, OTP)  │                     │  • Cloudinary (media)            │
│  • Storage (product images)  │                     │  • Resend (transactional email)  │
│  • Realtime (order updates)  │                     │  • AI provider (recs/chat)       │
└───────────────────────────┘                     └───────────────────────────────┘
```

## 2. Request Lifecycle (example: checkout)

1. Client submits checkout form → `POST /api/checkout` (Route Handler).
2. `middleware.ts` verifies Supabase session cookie, attaches user context, applies rate limiting.
3. Route handler validates payload with `zod` (`src/lib/validations/checkout.ts`).
4. `src/lib/orders/create-order.ts` runs inside a Postgres transaction (via Supabase RPC or sequential inserts with compensating rollback): reserve inventory → create `orders` + `order_items` → create payment intent (Stripe) or Razorpay order.
5. Client is redirected to the payment provider / confirms payment client-side.
6. Provider calls our webhook (`/api/payments/stripe/webhook` or `/api/payments/razorpay/webhook`) → verifies signature → marks order `paid` → triggers `order-confirmation` email (Resend) and decrements inventory.
7. User is redirected to `/checkout/success` which reads the order by id (RLS-scoped to `auth.uid()`).

## 3. Rendering Strategy

| Surface                         | Strategy                                             |
|----------------------------------|-------------------------------------------------------|
| Home, Category, Product listing  | Server Components + streaming, revalidated (ISR-like via `revalidatePath`/tag-based fetch caching) |
| Product details                  | Server Component, `generateStaticParams` for top sellers, on-demand ISR for the rest |
| Cart, Checkout, Account, Admin   | Server Component shell + Client Components for interactivity; session-gated, always dynamic |
| Search                           | Client-side instant search hitting `/api/search` (debounced) layered on a server-rendered fallback |
| Blog                              | Static generation + on-demand revalidation on publish |

## 4. State Management

- **Server state**: fetched in Server Components / Route Handlers, no client cache library needed for most reads.
- **Client/UI state**: `zustand` stores for cart, wishlist, compare list, and UI toggles — persisted to `localStorage` for guests, synced to Supabase on login.
- **Forms**: `react-hook-form` + `zod` resolvers everywhere (signup, checkout, admin CRUD).

## 5. Authentication & Authorization

- Supabase Auth issues JWT access/refresh tokens stored in **httpOnly, secure, SameSite=Lax cookies** via `@supabase/ssr`.
- `middleware.ts` refreshes sessions on every request and protects `(account)` and `(admin)` route groups.
- **Roles** (`customer`, `seller`, `admin`, `support`) stored in `profiles.role` + enforced twice: Postgres RLS policies (defense in depth) and route-level checks (`requireRole()` helper in `src/lib/security/authorize.ts`).

## 6. Payments Architecture

- Dual provider support: **Razorpay** (UPI/cards/netbanking/wallets for India) and **Stripe** (international cards).
- Provider chosen at checkout based on currency/region; both write to the same `payments` table with a `provider` discriminator column.
- Webhooks are the **source of truth** for payment state — client-side confirmation only improves UX, never mutates order status directly.

## 7. AI Architecture

- `src/lib/ai/client.ts` wraps a single LLM provider behind an interface (`generateRecommendations`, `summarizeReviews`, `chat`, `suggestSearchTerms`) so the provider can be swapped without touching call sites.
- Recommendations combine collaborative signals (order/view history in Postgres) with an LLM re-ranking pass; cached per user for a short TTL.

## 8. Security Layers

1. Edge middleware: security headers (CSP, HSTS, X-Frame-Options), rate limiting per-IP for auth/checkout/search endpoints.
2. Input validation: every API route validates with `zod` before touching the database.
3. Output encoding: React escapes by default; rich text (blog/product descriptions) sanitized with an allowlist sanitizer before render.
4. Database: parameterized queries only (Supabase client / RPC), RLS on every table, least-privilege service role usage confined to server-only code.
5. Secrets: never exposed to the client; `NEXT_PUBLIC_*` prefix reserved strictly for values safe to ship to the browser.

## 9. Deployment Topology

- **Vercel** hosts the Next.js app (Edge + Serverless functions).
- **Supabase** hosts Postgres, Auth, Storage, Realtime (managed, separate project per environment: dev/staging/prod).
- **Cloudinary** hosts product images/video with on-the-fly transformations.
- **GitHub Actions** runs lint/typecheck/test on PRs; Vercel deploys preview per PR and production on merge to `main`.

See `docs/DATABASE.md` for schema, `docs/API.md` for endpoint contracts, and `docs/DEPLOYMENT.md` for the release process.
