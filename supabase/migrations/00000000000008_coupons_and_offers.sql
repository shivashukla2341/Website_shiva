-- =============================================================================
-- Migration: Coupons, Offers, Flash Sales
-- =============================================================================

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type discount_type not null,
  discount_value numeric(12,2) not null check (discount_value > 0),
  min_order_value numeric(12,2) not null default 0,
  max_discount_amount numeric(12,2),
  usage_limit integer,
  usage_count integer not null default 0,
  per_user_limit integer not null default 1,
  scope coupon_scope not null default 'all',
  is_active boolean not null default true,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_coupons_code on coupons(code);
create index idx_coupons_active on coupons(is_active);

create trigger trg_coupons_updated_at
  before update on coupons
  for each row execute function set_updated_at();

create table coupon_scope_targets (
  coupon_id uuid not null references coupons(id) on delete cascade,
  target_type text not null check (target_type in ('category', 'product', 'brand')),
  target_id uuid not null,
  primary key (coupon_id, target_type, target_id)
);

create table coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references coupons(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  order_id uuid,
  discount_amount numeric(12,2) not null,
  redeemed_at timestamptz not null default now()
);

create index idx_coupon_redemptions_coupon_id on coupon_redemptions(coupon_id);
create index idx_coupon_redemptions_user_id on coupon_redemptions(user_id);

create table flash_sales (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  banner_url text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index idx_flash_sales_window on flash_sales(starts_at, ends_at);

create table flash_sale_products (
  flash_sale_id uuid not null references flash_sales(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  sale_price numeric(12,2) not null check (sale_price >= 0),
  stock_limit integer,
  sold_count integer not null default 0,
  primary key (flash_sale_id, product_id)
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table coupons enable row level security;
alter table coupon_scope_targets enable row level security;
alter table coupon_redemptions enable row level security;
alter table flash_sales enable row level security;
alter table flash_sale_products enable row level security;

create policy "coupons_public_read_active"
  on coupons for select using (is_active or is_staff(auth.uid()));
create policy "coupons_admin_write" on coupons for insert with check (is_staff(auth.uid()));
create policy "coupons_admin_update" on coupons for update using (is_staff(auth.uid()));
create policy "coupons_admin_delete" on coupons for delete using (is_staff(auth.uid()));

create policy "coupon_targets_public_read" on coupon_scope_targets for select using (true);
create policy "coupon_targets_admin_write" on coupon_scope_targets for insert with check (is_staff(auth.uid()));
create policy "coupon_targets_admin_delete" on coupon_scope_targets for delete using (is_staff(auth.uid()));

create policy "coupon_redemptions_owner_read"
  on coupon_redemptions for select using (auth.uid() = user_id or is_staff(auth.uid()));
create policy "coupon_redemptions_owner_write"
  on coupon_redemptions for insert with check (auth.uid() = user_id);

create policy "flash_sales_public_read" on flash_sales for select using (is_active or is_staff(auth.uid()));
create policy "flash_sales_admin_write" on flash_sales for insert with check (is_staff(auth.uid()));
create policy "flash_sales_admin_update" on flash_sales for update using (is_staff(auth.uid()));
create policy "flash_sales_admin_delete" on flash_sales for delete using (is_staff(auth.uid()));

create policy "flash_sale_products_public_read" on flash_sale_products for select using (true);
create policy "flash_sale_products_admin_write" on flash_sale_products for insert with check (is_staff(auth.uid()));
create policy "flash_sale_products_admin_update" on flash_sale_products for update using (is_staff(auth.uid()));
create policy "flash_sale_products_admin_delete" on flash_sale_products for delete using (is_staff(auth.uid()));
