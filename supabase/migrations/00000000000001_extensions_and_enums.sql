-- =============================================================================
-- Migration: Extensions & Enums
-- =============================================================================

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";       -- fuzzy/instant search
create extension if not exists "unaccent";      -- accent-insensitive search

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type user_role as enum ('customer', 'seller', 'admin', 'support');

create type address_type as enum ('shipping', 'billing');

create type product_status as enum ('draft', 'active', 'archived');

create type discount_type as enum ('percentage', 'fixed');

create type coupon_scope as enum ('all', 'category', 'product', 'brand');

create type order_status as enum (
  'pending', 'confirmed', 'processing', 'shipped',
  'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'
);

create type payment_provider as enum ('razorpay', 'stripe', 'cod');

create type payment_status as enum (
  'pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded'
);

create type return_status as enum (
  'requested', 'approved', 'rejected', 'picked_up', 'refunded'
);

create type ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');

create type ticket_priority as enum ('low', 'medium', 'high', 'urgent');

create type notification_type as enum ('order', 'promo', 'system', 'payment', 'support');

create type content_status as enum ('draft', 'published', 'archived');

create type seller_status as enum ('pending', 'approved', 'rejected', 'suspended');

create type affiliate_status as enum ('pending', 'approved', 'suspended');

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at current
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
