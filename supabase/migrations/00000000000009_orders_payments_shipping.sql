-- =============================================================================
-- Migration: Orders, Order Items, Payments, Shipments, Returns
-- =============================================================================

create sequence order_number_seq start 100000;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ORD-' || nextval('order_number_seq')::text),
  user_id uuid not null references profiles(id) on delete restrict,
  status order_status not null default 'pending',
  currency text not null default 'INR',
  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount_total numeric(12,2) not null default 0,
  shipping_total numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null check (grand_total >= 0),
  coupon_id uuid references coupons(id) on delete set null,
  shipping_address jsonb not null,
  billing_address jsonb not null,
  customer_note text,
  estimated_delivery_at date,
  placed_at timestamptz not null default now(),
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_user_id on orders(user_id);
create index idx_orders_status on orders(status);
create index idx_orders_order_number on orders(order_number);
create index idx_orders_placed_at on orders(placed_at desc);

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  seller_id uuid references sellers(id) on delete set null,
  product_name text not null,
  variant_label text,
  sku text not null,
  image_url text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  tax_amount numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

create index idx_order_items_order_id on order_items(order_id);
create index idx_order_items_product_id on order_items(product_id);
create index idx_order_items_seller_id on order_items(seller_id);

create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status not null,
  note text,
  changed_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_order_status_history_order_id on order_status_history(order_id, created_at desc);

-- Automatically log every status transition.
create or replace function log_order_status_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' or new.status <> old.status then
    insert into order_status_history (order_id, status, changed_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger trg_orders_log_status_insert
  after insert on orders
  for each row execute function log_order_status_change();

create trigger trg_orders_log_status_update
  after update of status on orders
  for each row execute function log_order_status_change();

-- ---------------------------------------------------------------------------
-- Payments
-- ---------------------------------------------------------------------------

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider payment_provider not null,
  provider_order_id text,
  provider_payment_id text,
  provider_signature text,
  method text,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'INR',
  status payment_status not null default 'pending',
  raw_response jsonb,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_payments_order_id on payments(order_id);
create index idx_payments_provider_payment_id on payments(provider_payment_id);
create index idx_payments_status on payments(status);

create trigger trg_payments_updated_at
  before update on payments
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Shipments
-- ---------------------------------------------------------------------------

create table shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  carrier text,
  tracking_number text,
  tracking_url text,
  status text not null default 'pending',
  shipped_at timestamptz,
  delivered_at timestamptz,
  estimated_delivery_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_shipments_order_id on shipments(order_id);
create index idx_shipments_tracking_number on shipments(tracking_number);

create trigger trg_shipments_updated_at
  before update on shipments
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Returns / Cancellations / Refunds
-- ---------------------------------------------------------------------------

create table returns (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  reason text not null,
  comment text,
  status return_status not null default 'requested',
  refund_amount numeric(12,2),
  requested_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index idx_returns_order_item_id on returns(order_item_id);
create index idx_returns_user_id on returns(user_id);
create index idx_returns_status on returns(status);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table payments enable row level security;
alter table shipments enable row level security;
alter table returns enable row level security;

create policy "orders_owner_read"
  on orders for select
  using (auth.uid() = user_id or is_staff(auth.uid()) or exists (
    select 1 from order_items oi join sellers s on s.id = oi.seller_id
    where oi.order_id = orders.id and s.user_id = auth.uid()
  ));

create policy "orders_owner_insert"
  on orders for insert with check (auth.uid() = user_id);

create policy "orders_staff_update"
  on orders for update using (is_staff(auth.uid()));

create policy "order_items_owner_read"
  on order_items for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
    or is_staff(auth.uid())
    or exists (select 1 from sellers s where s.id = seller_id and s.user_id = auth.uid()));

create policy "order_items_owner_insert"
  on order_items for insert
  with check (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()));

create policy "order_status_history_owner_read"
  on order_status_history for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()) or is_staff(auth.uid()));

create policy "payments_owner_read"
  on payments for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()) or is_staff(auth.uid()));

create policy "shipments_owner_read"
  on shipments for select
  using (exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid()) or is_staff(auth.uid()));

create policy "shipments_staff_write"
  on shipments for insert with check (is_staff(auth.uid()));
create policy "shipments_staff_update"
  on shipments for update using (is_staff(auth.uid()));

create policy "returns_owner_full_access"
  on returns for select using (auth.uid() = user_id or is_staff(auth.uid()));
create policy "returns_owner_insert"
  on returns for insert with check (auth.uid() = user_id);
create policy "returns_staff_update"
  on returns for update using (is_staff(auth.uid()));

-- Note: payments/order status mutations from server webhooks always go
-- through the Supabase service role (bypasses RLS by design) — see
-- src/lib/supabase/admin.ts. Client-side writers never touch payment status.

-- reviews.order_item_id was declared without a FK in migration 6 because
-- order_items did not exist yet; wire it up now (used for verified-purchase checks).
alter table reviews
  add constraint fk_reviews_order_item
  foreign key (order_item_id) references order_items(id) on delete set null;
