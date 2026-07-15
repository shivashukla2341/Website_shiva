# Folder Structure

Enterprise-level structure for the commercial e-commerce platform, built on Next.js 16 (App Router) + TypeScript.

```
website_shiva/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Public content pages (route group, shared marketing layout)
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   ├── privacy-policy/
│   │   │   ├── terms/
│   │   │   ├── shipping-policy/
│   │   │   ├── refund-policy/
│   │   │   ├── careers/
│   │   │   ├── become-seller/
│   │   │   ├── affiliate-program/
│   │   │   └── blog/[slug]/
│   │   │
│   │   ├── (shop)/                   # Commerce surface (route group)
│   │   │   ├── products/[slug]/      # Product details
│   │   │   ├── category/[slug]/
│   │   │   ├── brand/[slug]/
│   │   │   ├── offers/
│   │   │   ├── search/
│   │   │   ├── wishlist/
│   │   │   ├── compare/
│   │   │   ├── cart/
│   │   │   └── checkout/
│   │   │       ├── success/
│   │   │       └── failed/
│   │   │
│   │   ├── (auth)/                   # Auth flows (route group, centered auth layout)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── verify-otp/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── callback/             # OAuth callback (Google/GitHub)
│   │   │
│   │   ├── (account)/account/        # Authenticated user dashboard
│   │   │   ├── profile/
│   │   │   ├── orders/[id]/invoice/
│   │   │   ├── addresses/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   ├── settings/
│   │   │   ├── wishlist/
│   │   │   ├── support/
│   │   │   └── downloads/
│   │   │
│   │   ├── (admin)/admin/            # Admin panel (role-gated)
│   │   │   ├── dashboard/  analytics/  products/  categories/  brands/
│   │   │   ├── orders/  customers/  coupons/  offers/  inventory/
│   │   │   ├── shipping/  payments/  users/  roles/  blog/  pages/
│   │   │   ├── seo/  email-templates/  notifications/  logs/  settings/
│   │   │
│   │   ├── api/                      # Route Handlers (REST API)
│   │   │   ├── auth/  products/  categories/  brands/  cart/  wishlist/
│   │   │   ├── orders/  checkout/  coupons/  reviews/  addresses/  search/
│   │   │   ├── payments/{razorpay,stripe}/webhook/
│   │   │   ├── ai/{recommendations,chat,search-suggestions,review-summary}/
│   │   │   ├── admin/{products,orders,users,analytics}/
│   │   │   ├── notifications/  upload/  webhooks/
│   │   │
│   │   ├── layout.tsx                # Root layout (theme, fonts, providers)
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css
│   │   ├── sitemap.ts                # Dynamic sitemap
│   │   ├── robots.ts
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives (generated)
│   │   ├── layout/                   # Navbar, Footer, MobileNav, AdminSidebar
│   │   ├── home/                     # Hero, FeaturedProducts, FlashSale, etc.
│   │   ├── product/                  # ProductCard, Gallery, VariantSelector, Reviews
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── marketing/
│   │   ├── search/
│   │   ├── ai/                       # AI chat widget, recommendation rail
│   │   └── shared/                   # Breadcrumbs, EmptyState, Pagination wrappers
│   │
│   ├── lib/
│   │   ├── supabase/                 # client.ts, server.ts, middleware.ts, admin.ts
│   │   ├── payments/                 # razorpay.ts, stripe.ts
│   │   ├── email/                    # resend.ts, send helpers
│   │   ├── storage/                  # cloudinary.ts
│   │   ├── validations/              # zod schemas per domain
│   │   ├── ai/                       # AI provider clients + prompts
│   │   ├── api/                      # fetch wrappers, API response helpers
│   │   ├── security/                 # rate-limit.ts, sanitize.ts, csrf.ts
│   │   └── utils.ts
│   │
│   ├── hooks/                        # useCart, useWishlist, useDebounce, etc.
│   ├── store/                        # zustand stores (cart, wishlist, compare, ui)
│   ├── types/                        # shared TypeScript types + generated DB types
│   ├── config/                       # site.ts, nav.ts, payment.ts
│   ├── constants/
│   ├── emails/                       # React Email templates
│   └── middleware.ts                 # Auth/route protection middleware
│
├── supabase/
│   ├── migrations/                   # Numbered SQL migrations
│   └── seed/                         # Seed data
│
├── docs/                             # Documentation (this file + others)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .github/workflows/                # CI/CD
├── scripts/                          # One-off maintenance/build scripts
└── public/images/
```

## Conventions

- **Route groups** `(marketing)`, `(shop)`, `(auth)`, `(account)`, `(admin)` share layouts without affecting the URL path.
- **Server Components by default**; `"use client"` only where interactivity/state is required.
- **API routes** validate every input with `zod` and return a consistent `{ success, data | error }` envelope (see `docs/API.md`).
- **Domain logic** lives in `src/lib/*`, never inline in route handlers or page components — keeps API routes and Server Actions thin.
- **Types** are derived from the Supabase schema (`src/types/database.ts`, generated) plus hand-written domain types in `src/types/*.ts`.
