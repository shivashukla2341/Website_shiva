# Environment Variables

Copy `.env.example` to `.env.local` for local development. In Vercel, add each variable under Project Settings → Environment Variables, scoped per environment (Development / Preview / Production) — **never** reuse production secrets in Preview.

`NEXT_PUBLIC_*` variables are inlined into the client JS bundle at build time. Every other variable stays server-only (Route Handlers, Server Components, Server Actions).

## App

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical base URL, used for metadata, sitemap, OG tags, and payment redirect URLs. |
| `NEXT_PUBLIC_SITE_NAME` | ✅ | Display name used across UI and emails. |
| `NODE_ENV` | auto | Set by the runtime; don't override manually. |

## Supabase

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project URL from Supabase dashboard → Settings → API. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key — safe for the browser; RLS enforces access control. |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Secret.** Bypasses RLS. Used only in server-only code: webhook handlers, admin APIs, cron jobs. Never import into a Client Component. |
| `SUPABASE_JWT_SECRET` | optional | Needed only if you manually verify Supabase JWTs outside `@supabase/ssr`. |
| `DATABASE_URL` | dev only | Direct Postgres connection string for the Supabase CLI / migrations. |

## OAuth

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | for Google login | Registered in Supabase Auth → Providers → Google. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | for GitHub login | Registered in Supabase Auth → Providers → GitHub. |

## Payments

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ✅ (India) | Public key for Razorpay Checkout.js. |
| `RAZORPAY_KEY_SECRET` | ✅ | **Secret.** Used server-side to create orders and verify payment signatures. |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | Verifies `X-Razorpay-Signature` on incoming webhooks. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ (Intl) | Public key for Stripe.js/Elements. |
| `STRIPE_SECRET_KEY` | ✅ | **Secret.** Creates PaymentIntents server-side. |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Verifies Stripe webhook signatures. |

## Media (Cloudinary)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Used to build unsigned delivery URLs. |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | ✅ | **Secret.** Server-side signed uploads (admin product image upload). |
| `CLOUDINARY_UPLOAD_PRESET` | optional | For unsigned client-side uploads if used. |

## Email (Resend)

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | ✅ | **Secret.** Sends transactional email (welcome, order confirmation, OTP, password reset, shipping updates). |
| `RESEND_FROM_EMAIL` | ✅ | Verified sender identity. |

## AI

| Variable | Required | Description |
|---|---|---|
| `AI_PROVIDER` | ✅ | Provider discriminator consumed by `src/lib/ai/client.ts`. |
| `ANTHROPIC_API_KEY` | ✅ | **Secret.** Powers recommendations, chat support, review summarization, search suggestions. |
| `AI_MODEL` | ✅ | Model id, e.g. `claude-sonnet-5`. |

## Analytics

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | optional | Google Analytics 4 measurement id. |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | optional | Microsoft Clarity project id. |

## Security

| Variable | Required | Description |
|---|---|---|
| `CSRF_SECRET` | ✅ (prod) | Signs CSRF tokens for state-changing form submissions outside API routes protected by SameSite cookies alone. |
| `RATE_LIMIT_REDIS_URL` | ✅ (prod) | Backing store for distributed rate limiting (falls back to in-memory in dev). |

## Notifications (architecture placeholders)

SMS/WhatsApp/Push are documented as an integration point (`docs/ARCHITECTURE.md` §Notifications) but not wired into the UI in this phase. Variables are reserved so the integration is a drop-in later: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`, `WHATSAPP_BUSINESS_PHONE_ID`, `WHATSAPP_BUSINESS_ACCESS_TOKEN`, `WEB_PUSH_PUBLIC_VAPID_KEY`, `WEB_PUSH_PRIVATE_VAPID_KEY`.

## Secret hygiene

- `.env*` is git-ignored except `.env.example` (see `.gitignore`).
- Rotate any secret that was ever committed or pasted into a shared channel.
- Use different Supabase projects (and therefore different keys) for dev/staging/prod — never point a local `.env.local` at the production database.
