-- =============================================================================
-- Migration: Products, Variants, Attributes, Images
-- =============================================================================

create table products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references sellers(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  brand_id uuid references brands(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  status product_status not null default 'draft',
  base_price numeric(12,2) not null check (base_price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price >= 0),
  tax_rate numeric(5,2) not null default 18.00,
  currency text not null default 'INR',
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_best_seller boolean not null default false,
  video_url text,
  has_360_view boolean not null default false,
  avg_rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  sold_count integer not null default 0,
  view_count integer not null default 0,
  meta_title text,
  meta_description text,
  tags text[] not null default '{}',
  search_vector tsvector,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category_id on products(category_id);
create index idx_products_brand_id on products(brand_id);
create index idx_products_seller_id on products(seller_id);
create index idx_products_status on products(status);
create index idx_products_featured on products(is_featured) where is_featured;
create index idx_products_trending on products(is_trending) where is_trending;
create index idx_products_best_seller on products(is_best_seller) where is_best_seller;
create index idx_products_tags on products using gin(tags);
create index idx_products_search_vector on products using gin(search_vector);
create index idx_products_name_trgm on products using gin(name gin_trgm_ops);

create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- Keep full-text search vector in sync.
create or replace function products_search_vector_update()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', unaccent(coalesce(new.name, ''))), 'A') ||
    setweight(to_tsvector('english', unaccent(coalesce(new.short_description, ''))), 'B') ||
    setweight(to_tsvector('english', unaccent(coalesce(new.description, ''))), 'C') ||
    setweight(to_tsvector('english', unaccent(array_to_string(new.tags, ' '))), 'B');
  return new;
end;
$$;

create trigger trg_products_search_vector
  before insert or update of name, short_description, description, tags on products
  for each row execute function products_search_vector_update();

-- ---------------------------------------------------------------------------
-- Attributes (Color, Size, Storage, ...) used to build product variants
-- ---------------------------------------------------------------------------

create table attributes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null
);

create table attribute_values (
  id uuid primary key default gen_random_uuid(),
  attribute_id uuid not null references attributes(id) on delete cascade,
  value text not null,
  display_value text not null,
  hex_color text,
  unique (attribute_id, value)
);

create index idx_attribute_values_attribute_id on attribute_values(attribute_id);

-- ---------------------------------------------------------------------------
-- Variants
-- ---------------------------------------------------------------------------

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  barcode text,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 5,
  weight_grams integer,
  is_default boolean not null default false,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_product_variants_product_id on product_variants(product_id);
create index idx_product_variants_sku on product_variants(sku);
create unique index uq_product_variants_default
  on product_variants(product_id) where is_default;

create trigger trg_product_variants_updated_at
  before update on product_variants
  for each row execute function set_updated_at();

create table product_variant_attributes (
  variant_id uuid not null references product_variants(id) on delete cascade,
  attribute_value_id uuid not null references attribute_values(id) on delete cascade,
  primary key (variant_id, attribute_value_id)
);

-- ---------------------------------------------------------------------------
-- Media: images / 360 frames / videos
-- ---------------------------------------------------------------------------

create table product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video', '360')),
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_product_media_product_id on product_media(product_id);
create index idx_product_media_variant_id on product_media(variant_id);

-- ---------------------------------------------------------------------------
-- Inventory ledger (audit trail for every stock change)
-- ---------------------------------------------------------------------------

create table inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references product_variants(id) on delete cascade,
  change_quantity integer not null,
  reason text not null check (reason in (
    'restock', 'sale', 'return', 'adjustment', 'cancelled_order', 'damaged'
  )),
  reference_type text,
  reference_id uuid,
  created_by uuid references profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index idx_inventory_movements_variant_id on inventory_movements(variant_id);
create index idx_inventory_movements_created_at on inventory_movements(created_at desc);

-- Recently viewed products
create table recently_viewed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index idx_recently_viewed_user_id on recently_viewed(user_id, viewed_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table products enable row level security;
alter table attributes enable row level security;
alter table attribute_values enable row level security;
alter table product_variants enable row level security;
alter table product_variant_attributes enable row level security;
alter table product_media enable row level security;
alter table inventory_movements enable row level security;
alter table recently_viewed enable row level security;

create function is_staff(uid uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (select 1 from profiles p where p.id = uid and p.role in ('admin', 'support'));
$$;

create function owns_product(uid uuid, pid uuid)
returns boolean
language sql stable
security definer set search_path = public
as $$
  select exists (
    select 1 from products pr
    join sellers s on s.id = pr.seller_id
    where pr.id = pid and s.user_id = uid
  );
$$;

create policy "products_public_read"
  on products for select
  using (status = 'active' or is_staff(auth.uid()) or owns_product(auth.uid(), id));

create policy "products_seller_admin_write"
  on products for insert
  with check (is_staff(auth.uid()) or exists (
    select 1 from sellers s where s.id = seller_id and s.user_id = auth.uid() and s.status = 'approved'
  ));

create policy "products_seller_admin_update"
  on products for update
  using (is_staff(auth.uid()) or owns_product(auth.uid(), id));

create policy "products_admin_delete"
  on products for delete using (is_staff(auth.uid()));

create policy "attributes_public_read" on attributes for select using (true);
create policy "attributes_admin_write" on attributes for insert with check (is_staff(auth.uid()));
create policy "attributes_admin_update" on attributes for update using (is_staff(auth.uid()));
create policy "attributes_admin_delete" on attributes for delete using (is_staff(auth.uid()));

create policy "attribute_values_public_read" on attribute_values for select using (true);
create policy "attribute_values_admin_write" on attribute_values for insert with check (is_staff(auth.uid()));
create policy "attribute_values_admin_update" on attribute_values for update using (is_staff(auth.uid()));
create policy "attribute_values_admin_delete" on attribute_values for delete using (is_staff(auth.uid()));

create policy "variants_public_read"
  on product_variants for select
  using (
    is_active
    or is_staff(auth.uid())
    or owns_product(auth.uid(), product_id)
  );

create policy "variants_seller_admin_write"
  on product_variants for insert
  with check (is_staff(auth.uid()) or owns_product(auth.uid(), product_id));

create policy "variants_seller_admin_update"
  on product_variants for update
  using (is_staff(auth.uid()) or owns_product(auth.uid(), product_id));

create policy "variants_admin_delete"
  on product_variants for delete using (is_staff(auth.uid()));

create policy "variant_attrs_public_read" on product_variant_attributes for select using (true);
create policy "variant_attrs_write" on product_variant_attributes for insert
  with check (is_staff(auth.uid()) or owns_product(auth.uid(), (
    select product_id from product_variants v where v.id = variant_id
  )));
create policy "variant_attrs_delete" on product_variant_attributes for delete
  using (is_staff(auth.uid()) or owns_product(auth.uid(), (
    select product_id from product_variants v where v.id = variant_id
  )));

create policy "product_media_public_read" on product_media for select using (true);
create policy "product_media_write" on product_media for insert
  with check (is_staff(auth.uid()) or owns_product(auth.uid(), product_id));
create policy "product_media_update" on product_media for update
  using (is_staff(auth.uid()) or owns_product(auth.uid(), product_id));
create policy "product_media_delete" on product_media for delete
  using (is_staff(auth.uid()) or owns_product(auth.uid(), product_id));

create policy "inventory_movements_staff_seller_read"
  on inventory_movements for select
  using (is_staff(auth.uid()) or owns_product(auth.uid(), (
    select product_id from product_variants v where v.id = variant_id
  )));
create policy "inventory_movements_staff_seller_write"
  on inventory_movements for insert
  with check (is_staff(auth.uid()) or owns_product(auth.uid(), (
    select product_id from product_variants v where v.id = variant_id
  )));

create policy "recently_viewed_owner_full_access"
  on recently_viewed for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
