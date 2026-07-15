-- =============================================================================
-- Migration: Profiles & Addresses
-- profiles extends auth.users (1:1), created automatically via trigger below.
-- =============================================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role user_role not null default 'customer',
  date_of_birth date,
  gender text,
  is_phone_verified boolean not null default false,
  marketing_opt_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_role on profiles(role);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Prevent self-service privilege escalation: only an existing admin (or the
-- service role, which bypasses RLS/triggers is NOT the case for triggers, so
-- this still applies) may change a profile's role.
create or replace function guard_profile_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role <> old.role and not exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ) then
    new.role = old.role;
  end if;
  return new;
end;
$$;

create trigger trg_guard_profile_role_change
  before update of role on profiles
  for each row execute function guard_profile_role_change();

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Addresses
-- ---------------------------------------------------------------------------

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type address_type not null default 'shipping',
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'IN',
  landmark text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_addresses_user_id on addresses(user_id);

create trigger trg_addresses_updated_at
  before update on addresses
  for each row execute function set_updated_at();

-- Only one default address per user per type.
create unique index uq_addresses_default_per_user
  on addresses(user_id, type)
  where is_default;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;
alter table addresses enable row level security;

create policy "profiles_select_own_or_admin"
  on profiles for select
  using (auth.uid() = id or exists (
    select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'support')
  ));

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "addresses_owner_full_access"
  on addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "addresses_admin_read"
  on addresses for select
  using (exists (
    select 1 from profiles p where p.id = auth.uid() and p.role in ('admin', 'support')
  ));
