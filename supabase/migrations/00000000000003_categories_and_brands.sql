-- =============================================================================
-- Migration: Categories & Brands
-- =============================================================================

create table categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  icon text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_categories_parent_id on categories(parent_id);
create index idx_categories_slug on categories(slug);
create index idx_categories_active on categories(is_active);

create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();

create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  banner_url text,
  website_url text,
  is_active boolean not null default true,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_brands_slug on brands(slug);
create index idx_brands_active on brands(is_active);

create trigger trg_brands_updated_at
  before update on brands
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: public catalog data is world-readable; writes restricted to admins.
-- ---------------------------------------------------------------------------

alter table categories enable row level security;
alter table brands enable row level security;

create policy "categories_public_read"
  on categories for select
  using (is_active or exists (
    select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'seller')
  ));

create policy "categories_admin_write"
  on categories for insert with check (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "categories_admin_update"
  on categories for update using (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "categories_admin_delete"
  on categories for delete using (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "brands_public_read"
  on brands for select
  using (is_active or exists (
    select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'seller')
  ));

create policy "brands_admin_write"
  on brands for insert with check (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "brands_admin_update"
  on brands for update using (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "brands_admin_delete"
  on brands for delete using (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
