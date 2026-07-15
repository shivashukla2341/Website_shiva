-- =============================================================================
-- Migration: Sellers (Become a Seller)
-- =============================================================================

create table sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  business_name text not null,
  gstin text,
  pan text,
  status seller_status not null default 'pending',
  commission_rate numeric(5,2) not null default 10.00,
  support_email text,
  support_phone text,
  bank_account_name text,
  bank_account_number text,
  bank_ifsc text,
  rejection_reason text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_sellers_status on sellers(status);

create trigger trg_sellers_updated_at
  before update on sellers
  for each row execute function set_updated_at();

alter table sellers enable row level security;

create policy "sellers_owner_read"
  on sellers for select
  using (auth.uid() = user_id or exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "sellers_owner_apply"
  on sellers for insert
  with check (auth.uid() = user_id);

create policy "sellers_owner_update_pending_only"
  on sellers for update
  using (auth.uid() = user_id and status = 'pending');

create policy "sellers_admin_update"
  on sellers for update
  using (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
