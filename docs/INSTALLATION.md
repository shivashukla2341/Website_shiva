# Installation Guide

## Prerequisites

- Node.js 20+ and npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm install -g supabase` or via Homebrew) — for local Postgres/Auth/Storage
- Docker (the Supabase CLI runs its local stack in containers)
- Accounts/API keys for: Supabase, Razorpay, Stripe, Cloudinary, Resend, and an AI provider (Anthropic)

## 1. Clone & install dependencies

```bash
git clone <repo-url>
cd website_shiva
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in each key — see [`docs/ENVIRONMENT_VARIABLES.md`](ENVIRONMENT_VARIABLES.md) for where to find every value.

## 3. Start Supabase locally

```bash
supabase init      # only needed once, already committed as supabase/config.toml is added in Step 6
supabase start
```

This spins up local Postgres, Auth, Storage, and Studio (usually at `http://localhost:54323`). Copy the printed `anon key`, `service_role key`, and API URL into `.env.local` if you're pointing at the local stack instead of a hosted Supabase project.

## 4. Apply database migrations + seed data

```bash
supabase db reset
```

This runs every file in `supabase/migrations/` in order, then `supabase/seed/seed.sql`. See [`docs/DATABASE.md`](DATABASE.md) for what gets created.

> Prefer a hosted Supabase project instead of running locally? Run `supabase link --project-ref <ref>` then `supabase db push`, and run the seed file manually via `psql "$DATABASE_URL" -f supabase/seed/seed.sql` (only for a dev/staging project — never seed production with sample data).

## 5. Configure OAuth providers (optional but recommended)

In the Supabase dashboard → Authentication → Providers:
- Enable **Google**: add `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` from Google Cloud Console, add the Supabase callback URL as an authorized redirect URI.
- Enable **GitHub**: same flow via a GitHub OAuth App.
- Enable **Phone (OTP)** if you want SMS-based OTP verification, or use email OTP (no extra provider needed).

## 6. Configure payment providers

- **Razorpay**: create an account, grab the test-mode Key ID/Secret, set up a webhook pointing at `<NEXT_PUBLIC_SITE_URL>/api/payments/razorpay/webhook` with the `payment.captured` and `payment.failed` events, copy the webhook secret.
- **Stripe**: grab the test-mode publishable/secret keys, run `stripe listen --forward-to localhost:3000/api/payments/stripe/webhook` for local webhook testing, copy the CLI-provided webhook secret into `.env.local`.

## 7. Configure Cloudinary & Resend

- Cloudinary: create an unsigned upload preset for client-side product image uploads (admin panel), or use signed uploads via the API key/secret (server-side).
- Resend: verify a sending domain (or use their sandbox domain for dev) and generate an API key.

## 8. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Admin routes live under `/admin` and require a `profiles.role = 'admin'` user — promote your dev user via Supabase Studio's table editor (`update profiles set role = 'admin' where id = '<your-user-id>'`) since self-promotion is blocked by design (see `docs/DATABASE.md`).

## Troubleshooting

| Symptom | Fix |
|---|---|
| `relation "profiles" does not exist` | Migrations haven't run — `supabase db reset`. |
| Login works but no `profiles` row | The `handle_new_user` trigger only fires for **new** signups; for pre-existing `auth.users` rows created before migrations, insert a `profiles` row manually. |
| Webhook signature verification fails | Confirm `RAZORPAY_WEBHOOK_SECRET`/`STRIPE_WEBHOOK_SECRET` match the dashboard/CLI-issued secret, and that you're forwarding to the exact route path. |
| Images not loading from Cloudinary | Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and that `next.config.ts` allows the Cloudinary image domain (added in Step 6). |
