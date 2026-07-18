# Production Deployment Checklist for NexCart

Before pushing your final build to Vercel, ensure the following checklist is completed to guarantee a smooth, secure, and performant production launch.

## 1. Environment Variables
- [ ] Ensure all development URLs are replaced with production URLs.
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel environment.
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment.
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment.
- [ ] Add `RESEND_API_KEY` for transactional emails.
- [ ] Add Stripe / Razorpay secret keys (`STRIPE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`).
- [ ] Add Payment webhook secrets (`STRIPE_WEBHOOK_SECRET`, `RAZORPAY_WEBHOOK_SECRET`).

## 2. Database & Auth (Supabase)
- [ ] Disable "Enable Email Confirmations" if you don't want strict email verification, OR configure custom SMTP via Resend in Supabase Auth settings.
- [ ] Set up the **Site URL** in Supabase Auth settings to your production Vercel domain (e.g., `https://nexcart.com`).
- [ ] Add localhost and production URLs to Supabase Auth **Redirect URLs**.
- [ ] Run `npm run build` locally one last time to ensure no TypeScript or Linting errors are thrown.
- [ ] Ensure all Row Level Security (RLS) policies are STRICT. Users should only be able to SELECT/UPDATE their own rows.

## 3. Webhooks
- [ ] Register your production Vercel URL in your Stripe/Razorpay dashboard for webhooks.
  - URL format: `https://your-domain.com/api/webhooks/stripe`
- [ ] Update the webhook secrets in Vercel to match the new production webhook endpoints.

## 4. Performance & SEO
- [ ] Verify `robots.txt` allows indexing (unless it's a staging environment).
- [ ] Verify `sitemap.ts` generates correct absolute URLs for the production domain.
- [ ] Ensure all static assets (images, fonts) are loading correctly on the preview deployment.

## 5. Testing
- [ ] Run `npm run test` to execute Jest unit tests.
- [ ] Run `npx playwright test` to ensure critical user journeys (Checkout, Auth) are functioning perfectly.
- [ ] Perform a manual End-to-End test on the Vercel Preview URL before promoting it to the Production domain.
