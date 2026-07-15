-- =============================================================================
-- Migration: Affiliate Program & System Tables (audit log, settings, email templates)
-- =============================================================================

create table affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  code text not null unique,
  status affiliate_status not null default 'pending',
  commission_rate numeric(5,2) not null default 5.00,
  total_earnings numeric(12,2) not null default 0,
  total_paid numeric(12,2) not null default 0,
  payout_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_affiliates_code on affiliates(code);

create trigger trg_affiliates_updated_at
  before update on affiliates
  for each row execute function set_updated_at();

create table affiliate_referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references affiliates(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  commission_amount numeric(12,2) not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'void')),
  created_at timestamptz not null default now()
);

create index idx_affiliate_referrals_affiliate_id on affiliate_referrals(affiliate_id);
create unique index uq_affiliate_referrals_order on affiliate_referrals(order_id);

-- ---------------------------------------------------------------------------
-- System: audit log, site settings, email templates
-- ---------------------------------------------------------------------------

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  ip_address inet,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index idx_audit_logs_actor_id on audit_logs(actor_id);
create index idx_audit_logs_created_at on audit_logs(created_at desc);

create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

create table email_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  subject text not null,
  html_body text not null,
  description text,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create trigger trg_email_templates_updated_at
  before update on email_templates
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table affiliates enable row level security;
alter table affiliate_referrals enable row level security;
alter table audit_logs enable row level security;
alter table site_settings enable row level security;
alter table email_templates enable row level security;

create policy "affiliates_owner_read" on affiliates for select
  using (auth.uid() = user_id or is_staff(auth.uid()));
create policy "affiliates_owner_apply" on affiliates for insert with check (auth.uid() = user_id);
create policy "affiliates_admin_update" on affiliates for update using (is_staff(auth.uid()));

create policy "affiliate_referrals_owner_read" on affiliate_referrals for select
  using (is_staff(auth.uid()) or exists (
    select 1 from affiliates a where a.id = affiliate_id and a.user_id = auth.uid()
  ));

create policy "audit_logs_admin_read" on audit_logs for select using (is_staff(auth.uid()));
-- No insert policy: audit log rows are only ever written by trusted
-- server-side code using the Supabase service role, which bypasses RLS.
-- This keeps the audit trail tamper-proof from authenticated clients.

create policy "site_settings_public_read" on site_settings for select using (true);
create policy "site_settings_admin_write" on site_settings for insert with check (is_staff(auth.uid()));
create policy "site_settings_admin_update" on site_settings for update using (is_staff(auth.uid()));

create policy "email_templates_admin_only" on email_templates for select using (is_staff(auth.uid()));
create policy "email_templates_admin_write" on email_templates for insert with check (is_staff(auth.uid()));
create policy "email_templates_admin_update" on email_templates for update using (is_staff(auth.uid()));
