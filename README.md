# Website Shiva

A production-grade e-commerce platform — Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui on the frontend, Supabase (Postgres + Auth + Storage) on the backend, with Razorpay/Stripe payments, Cloudinary media, Resend email, and AI-assisted search/recommendations/support.

This repository is being built in explicit stages; progress and remaining work are tracked as commits and in the sections below.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, Lucide Icons |
| Backend | Next.js Route Handlers (REST API) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (email/password, Google, GitHub, OTP) |
| Payments | Razorpay + Stripe |
| Storage | Cloudinary |
| Email | Resend |
| Validation / Forms | Zod + React Hook Form |
| Charts | Recharts |
| State | Zustand (cart/wishlist/compare), Server Components for server state |
| Deployment | Vercel |
| Analytics | Google Analytics, Microsoft Clarity |

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture, request lifecycle, security layers
- [`docs/DATABASE.md`](docs/DATABASE.md) — full schema reference, ER diagram, RLS model
- [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md) — project layout and conventions
- [`docs/ENVIRONMENT_VARIABLES.md`](docs/ENVIRONMENT_VARIABLES.md) — every env var, what it's for, where to get it
- [`docs/INSTALLATION.md`](docs/INSTALLATION.md) — local setup, step by step
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — releasing to Vercel + Supabase
- [`docs/API.md`](docs/API.md) — REST API contract

## Quick Start

```bash
git clone <repo-url>
cd website_shiva
npm install
cp .env.example .env.local   # fill in Supabase/Stripe/Razorpay/etc keys
supabase start                # local Supabase stack (Postgres + Auth + Storage)
supabase db reset             # applies supabase/migrations/*.sql + seed data
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). See [`docs/INSTALLATION.md`](docs/INSTALLATION.md) for the full walkthrough including provider setup (Supabase, Razorpay, Stripe, Cloudinary, Resend).

## Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint
npm run test     # unit/integration tests (see docs once Step 13 lands)
```

## Project Status

Being built step by step per the project brief: folder structure → architecture → database schema → env config → installation docs → base UI → auth → core pages → backend APIs → admin panel → payments → AI features → testing → deployment → production checklist. See commit history for progress.

## License

Proprietary — all rights reserved unless a `LICENSE` file states otherwise.
