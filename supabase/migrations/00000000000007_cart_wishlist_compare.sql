-- =============================================================================
-- Migration: Cart, Wishlist, Compare
-- Guests get a cart keyed by session_id (cookie); merged into user_id on login.
-- =============================================================================

create table carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or session_id is not null)
);

create unique index uq_carts_user_id on carts(user_id) where user_id is not null;
create unique index uq_carts_session_id on carts(session_id) where session_id is not null;

create trigger trg_carts_updated_at
  before update on carts
  for each row execute function set_updated_at();

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  variant_id uuid not null references product_variants(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  saved_for_later boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create index idx_cart_items_cart_id on cart_items(cart_id);

create trigger trg_cart_items_updated_at
  before update on cart_items
  for each row execute function set_updated_at();

create table wishlist_items (
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table compare_items (
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table carts enable row level security;
alter table cart_items enable row level security;
alter table wishlist_items enable row level security;
alter table compare_items enable row level security;

-- Guest carts are identified by an unguessable session_id issued server-side
-- and matched via a signed request context (see src/lib/supabase middleware),
-- so anonymous access is only permitted through the service role in API
-- routes rather than directly from the client.
create policy "carts_owner_full_access"
  on carts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "cart_items_owner_full_access"
  on cart_items for all
  using (exists (select 1 from carts c where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from carts c where c.id = cart_id and c.user_id = auth.uid()));

create policy "wishlist_owner_full_access"
  on wishlist_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "compare_owner_full_access"
  on compare_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
