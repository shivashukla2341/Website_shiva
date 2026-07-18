-- =============================================================================
-- NEXCART — COMPLETE POSTGRESQL DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- =============================================================================
-- Run this in your Supabase SQL Editor or via: supabase db push
-- =============================================================================

-- ─── Enable Extensions ───────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- For fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- For search normalization
CREATE EXTENSION IF NOT EXISTS "vector";         -- For AI embeddings (pgvector)

-- ─── Custom Types / Enums ────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin', 'super_admin');
CREATE TYPE address_label AS ENUM ('home', 'work', 'other');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'archived');
CREATE TYPE weight_unit AS ENUM ('g', 'kg', 'lb', 'oz');
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped',
  'out_for_delivery', 'delivered', 'cancelled',
  'return_requested', 'returned', 'refunded'
);
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
CREATE TYPE payment_method AS ENUM ('razorpay', 'stripe', 'cod', 'wallet', 'upi');
CREATE TYPE payment_gateway AS ENUM ('razorpay', 'stripe', 'cod');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y');
CREATE TYPE return_reason AS ENUM ('damaged', 'wrong_item', 'quality_issue', 'not_as_described', 'changed_mind', 'other');
CREATE TYPE return_status AS ENUM ('pending', 'approved', 'rejected', 'picked_up', 'processed');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE notification_type AS ENUM (
  'order_placed', 'order_shipped', 'order_delivered', 'order_cancelled',
  'payment_success', 'payment_failed', 'review_reply',
  'product_back_in_stock', 'price_drop', 'promotional', 'system'
);
CREATE TYPE affiliate_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE offer_discount_type AS ENUM ('percentage', 'fixed');

-- =============================================================================
-- TABLE: profiles
-- Extends Supabase auth.users with store-specific profile data
-- =============================================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name    TEXT NOT NULL DEFAULT '',
  last_name     TEXT NOT NULL DEFAULT '',
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  date_of_birth DATE,
  gender        gender_type,
  phone         TEXT,
  phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  role          user_role NOT NULL DEFAULT 'customer',
  gst_number    TEXT,
  pan_number    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_seen_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_phone ON profiles(phone);

-- =============================================================================
-- TABLE: addresses
-- =============================================================================
CREATE TABLE addresses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label          address_label NOT NULL DEFAULT 'home',
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address_line1  TEXT NOT NULL,
  address_line2  TEXT,
  landmark       TEXT,
  city           TEXT NOT NULL,
  state          TEXT NOT NULL,
  pincode        TEXT NOT NULL,
  country        TEXT NOT NULL DEFAULT 'India',
  is_default     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default);

-- =============================================================================
-- TABLE: categories
-- Supports unlimited nesting via parent_id (adjacency list)
-- =============================================================================
CREATE TABLE categories (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  image_url        TEXT,
  parent_id        UUID REFERENCES categories(id) ON DELETE SET NULL,
  level            INTEGER NOT NULL DEFAULT 0,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  meta_title       TEXT,
  meta_description TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- =============================================================================
-- TABLE: brands
-- =============================================================================
CREATE TABLE brands (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  logo_url         TEXT,
  website_url      TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  meta_title       TEXT,
  meta_description TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_active ON brands(is_active);
CREATE INDEX idx_brands_featured ON brands(is_featured);

-- =============================================================================
-- TABLE: products
-- Core product catalog
-- =============================================================================
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT NOT NULL UNIQUE,
  sku              TEXT UNIQUE,
  name             TEXT NOT NULL,
  short_description TEXT,
  description      TEXT NOT NULL DEFAULT '',
  category_id      UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  brand_id         UUID REFERENCES brands(id) ON DELETE SET NULL,
  tags             TEXT[] NOT NULL DEFAULT '{}',
  status           product_status NOT NULL DEFAULT 'draft',
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  is_trending      BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_seller   BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival   BOOLEAN NOT NULL DEFAULT FALSE,
  -- Price (base/minimum across variants)
  price            NUMERIC(12,2) NOT NULL,
  compare_at_price NUMERIC(12,2),
  cost_price       NUMERIC(12,2),
  tax_rate         NUMERIC(5,2) NOT NULL DEFAULT 18.00,
  tax_inclusive    BOOLEAN NOT NULL DEFAULT FALSE,
  -- Physical
  weight           NUMERIC(10,3),
  weight_unit      weight_unit DEFAULT 'g',
  length           NUMERIC(10,2),
  width            NUMERIC(10,2),
  height           NUMERIC(10,2),
  dimension_unit   TEXT DEFAULT 'cm',
  -- Variant flag
  has_variants     BOOLEAN NOT NULL DEFAULT FALSE,
  -- Stats (denormalized for performance)
  average_rating   NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count     INTEGER NOT NULL DEFAULT 0,
  view_count       INTEGER NOT NULL DEFAULT 0,
  sold_count       INTEGER NOT NULL DEFAULT 0,
  -- SEO
  meta_title       TEXT,
  meta_description TEXT,
  meta_keywords    TEXT[] NOT NULL DEFAULT '{}',
  -- Search vector
  search_vector    TSVECTOR,
  -- AI embedding
  embedding        VECTOR(1536),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_trending ON products(is_trending) WHERE is_trending = TRUE;
CREATE INDEX idx_products_best_seller ON products(is_best_seller) WHERE is_best_seller = TRUE;
CREATE INDEX idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = TRUE;
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(average_rating);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_embedding ON products USING ivfflat(embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_name_trgm ON products USING GIN(name gin_trgm_ops);

-- Auto-update search_vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_search_vector
  BEFORE INSERT OR UPDATE OF name, short_description, description, tags
  ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- =============================================================================
-- TABLE: product_variants
-- SKU-level product variants (color, size, storage, etc.)
-- =============================================================================
CREATE TABLE product_variants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku             TEXT NOT NULL UNIQUE,
  barcode         TEXT,
  name            TEXT NOT NULL,
  options         JSONB NOT NULL DEFAULT '{}',  -- {"color": "Red", "size": "XL"}
  price           NUMERIC(12,2) NOT NULL,
  compare_at_price NUMERIC(12,2),
  cost_price      NUMERIC(12,2),
  weight          NUMERIC(10,3),
  weight_unit     weight_unit DEFAULT 'g',
  image_url       TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_active ON product_variants(product_id, is_active);

-- =============================================================================
-- TABLE: inventory
-- Per-variant stock tracking
-- =============================================================================
CREATE TABLE inventory (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id           UUID NOT NULL UNIQUE REFERENCES product_variants(id) ON DELETE CASCADE,
  product_id           UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity             INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity    INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  low_stock_threshold  INTEGER NOT NULL DEFAULT 5,
  track_inventory      BOOLEAN NOT NULL DEFAULT TRUE,
  allow_backorder      BOOLEAN NOT NULL DEFAULT FALSE,
  warehouse_location   TEXT,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_variant_id ON inventory(variant_id);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_low_stock ON inventory(quantity) WHERE quantity <= low_stock_threshold;

-- View: available quantity
CREATE VIEW inventory_status AS
SELECT
  i.*,
  (i.quantity - i.reserved_quantity) AS available_quantity,
  CASE
    WHEN NOT i.track_inventory THEN TRUE
    WHEN i.allow_backorder THEN TRUE
    ELSE (i.quantity - i.reserved_quantity) > 0
  END AS in_stock,
  CASE
    WHEN i.track_inventory AND (i.quantity - i.reserved_quantity) <= i.low_stock_threshold
    THEN TRUE ELSE FALSE
  END AS is_low_stock
FROM inventory i;

-- =============================================================================
-- TABLE: product_images
-- Multiple images per product
-- =============================================================================
CREATE TABLE product_images (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt_text   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_default ON product_images(product_id, is_default);

-- =============================================================================
-- TABLE: product_videos
-- =============================================================================
CREATE TABLE product_videos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  thumbnail_url TEXT,
  title         TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_videos_product_id ON product_videos(product_id);

-- =============================================================================
-- TABLE: reviews
-- Product reviews & ratings
-- =============================================================================
CREATE TABLE reviews (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id            UUID,  -- FK added after orders table
  rating              SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title               TEXT,
  body                TEXT NOT NULL,
  images              TEXT[] NOT NULL DEFAULT '{}',
  is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved         BOOLEAN NOT NULL DEFAULT FALSE,
  helpful_count       INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id, order_id)
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(product_id, is_approved);
CREATE INDEX idx_reviews_rating ON reviews(product_id, rating);

-- =============================================================================
-- TABLE: questions & answers
-- Product Q&A
-- =============================================================================
CREATE TABLE questions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  is_answered BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_product_id ON questions(product_id);

CREATE TABLE answers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id       UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_seller_response BOOLEAN NOT NULL DEFAULT FALSE,
  answer            TEXT NOT NULL,
  helpful_count     INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_question_id ON answers(question_id);

-- =============================================================================
-- TABLE: coupons
-- =============================================================================
CREATE TABLE coupons (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                 TEXT NOT NULL UNIQUE,
  description          TEXT,
  type                 coupon_type NOT NULL,
  value                NUMERIC(10,2) NOT NULL,
  min_order_amount     NUMERIC(12,2),
  max_discount_amount  NUMERIC(12,2),
  usage_limit          INTEGER,
  usage_limit_per_user INTEGER,
  used_count           INTEGER NOT NULL DEFAULT 0,
  category_ids         UUID[] DEFAULT '{}',
  product_ids          UUID[] DEFAULT '{}',
  user_ids             UUID[] DEFAULT '{}',
  starts_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at           TIMESTAMPTZ,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_by           UUID REFERENCES auth.users(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active, starts_at, expires_at);

-- =============================================================================
-- TABLE: offers
-- Flash sales and time-limited offers
-- =============================================================================
CREATE TABLE offers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  description    TEXT,
  banner_url     TEXT,
  discount_type  offer_discount_type NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  product_ids    UUID[] DEFAULT '{}',
  category_ids   UUID[] DEFAULT '{}',
  brand_ids      UUID[] DEFAULT '{}',
  starts_at      TIMESTAMPTZ NOT NULL,
  ends_at        TIMESTAMPTZ NOT NULL,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_offers_active ON offers(is_active, starts_at, ends_at);

-- =============================================================================
-- TABLE: wishlists
-- =============================================================================
CREATE TABLE wishlists (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);

-- =============================================================================
-- TABLE: carts & cart_items
-- Supports both authenticated and guest carts
-- =============================================================================
CREATE TABLE carts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id   TEXT,
  coupon_code  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

CREATE TABLE cart_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id    UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price      NUMERIC(12,2) NOT NULL,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(cart_id, product_id, variant_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);

-- =============================================================================
-- TABLE: orders
-- =============================================================================
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number     TEXT NOT NULL UNIQUE,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status           order_status NOT NULL DEFAULT 'pending',
  payment_status   payment_status NOT NULL DEFAULT 'pending',
  payment_method   payment_method NOT NULL,
  -- Pricing
  subtotal         NUMERIC(12,2) NOT NULL,
  discount         NUMERIC(12,2) NOT NULL DEFAULT 0,
  coupon_code      TEXT,
  coupon_discount  NUMERIC(12,2) DEFAULT 0,
  shipping_charge  NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax              NUMERIC(12,2) NOT NULL DEFAULT 0,
  total            NUMERIC(12,2) NOT NULL,
  -- Address (snapshot at time of order)
  shipping_address JSONB NOT NULL,
  billing_address  JSONB,
  -- Delivery
  tracking_number  TEXT,
  tracking_url     TEXT,
  estimated_delivery TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ,
  -- Cancellation
  cancelled_at     TIMESTAMPTZ,
  cancel_reason    TEXT,
  -- Notes / GST
  notes            TEXT,
  gst_number       TEXT,
  invoice_url      TEXT,
  -- Timestamps
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- =============================================================================
-- TABLE: order_items
-- Line items for each order
-- =============================================================================
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id      UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
  -- Snapshot of product data at time of order
  product_name    TEXT NOT NULL,
  product_image   TEXT,
  variant_name    TEXT,
  variant_options JSONB,
  sku             TEXT,
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  price           NUMERIC(12,2) NOT NULL,
  compare_at_price NUMERIC(12,2),
  tax             NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  subtotal        NUMERIC(12,2) NOT NULL,
  can_return      BOOLEAN NOT NULL DEFAULT TRUE,
  can_cancel      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Add FK for reviews
ALTER TABLE reviews ADD CONSTRAINT fk_reviews_order_id
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- =============================================================================
-- TABLE: order_tracking
-- Shipment tracking history
-- =============================================================================
CREATE TABLE order_tracking (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status      order_status NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);

-- =============================================================================
-- TABLE: payments
-- Payment transaction records
-- =============================================================================
CREATE TABLE payments (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  method              payment_method NOT NULL,
  gateway             payment_gateway NOT NULL,
  gateway_order_id    TEXT,
  gateway_payment_id  TEXT UNIQUE,
  gateway_signature   TEXT,
  amount              NUMERIC(12,2) NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'INR',
  status              payment_status NOT NULL DEFAULT 'pending',
  metadata            JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_gateway_payment_id ON payments(gateway_payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =============================================================================
-- TABLE: refunds
-- =============================================================================
CREATE TABLE refunds (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_id        UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES auth.users(id),
  amount            NUMERIC(12,2) NOT NULL,
  reason            TEXT,
  gateway_refund_id TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',
  processed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refunds_order_id ON refunds(order_id);
CREATE INDEX idx_refunds_user_id ON refunds(user_id);

-- =============================================================================
-- TABLE: return_requests
-- =============================================================================
CREATE TABLE return_requests (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  items       JSONB NOT NULL DEFAULT '[]',
  reason      return_reason NOT NULL,
  description TEXT,
  images      TEXT[] DEFAULT '{}',
  status      return_status NOT NULL DEFAULT 'pending',
  refund_amount NUMERIC(12,2),
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_return_requests_order_id ON return_requests(order_id);
CREATE INDEX idx_return_requests_user_id ON return_requests(user_id);

-- =============================================================================
-- TABLE: coupon_usage
-- Track coupon redemptions
-- =============================================================================
CREATE TABLE coupon_usage (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id  UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount   NUMERIC(12,2) NOT NULL,
  used_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(coupon_id, order_id)
);

CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);

-- =============================================================================
-- TABLE: notifications
-- =============================================================================
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  image_url  TEXT,
  action_url TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =============================================================================
-- TABLE: support_tickets
-- =============================================================================
CREATE TABLE support_tickets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT NOT NULL UNIQUE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id      UUID REFERENCES orders(id) ON DELETE SET NULL,
  subject       TEXT NOT NULL,
  status        ticket_status NOT NULL DEFAULT 'open',
  priority      ticket_priority NOT NULL DEFAULT 'medium',
  assigned_to   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_assigned_to ON support_tickets(assigned_to);

CREATE TABLE ticket_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id   UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_agent    BOOLEAN NOT NULL DEFAULT FALSE,
  message     TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- =============================================================================
-- TABLE: recently_viewed
-- =============================================================================
CREATE TABLE recently_viewed (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_recently_viewed_user_id ON recently_viewed(user_id, viewed_at DESC);

-- =============================================================================
-- TABLE: compare_list
-- =============================================================================
CREATE TABLE compare_list (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_compare_list_user_id ON compare_list(user_id);

-- =============================================================================
-- TABLE: blog_categories
-- =============================================================================
CREATE TABLE blog_categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: blog_posts
-- =============================================================================
CREATE TABLE blog_posts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  excerpt          TEXT,
  content          TEXT NOT NULL,
  cover_image_url  TEXT,
  author_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  category_id      UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  tags             TEXT[] NOT NULL DEFAULT '{}',
  status           blog_status NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  view_count       INTEGER NOT NULL DEFAULT 0,
  meta_title       TEXT,
  meta_description TEXT,
  search_vector    TSVECTOR,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_vector);

-- =============================================================================
-- TABLE: affiliates
-- =============================================================================
CREATE TABLE affiliates (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code     TEXT NOT NULL UNIQUE,
  commission_rate   NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  total_earnings    NUMERIC(12,2) NOT NULL DEFAULT 0,
  pending_earnings  NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_earnings     NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_clicks      INTEGER NOT NULL DEFAULT 0,
  total_conversions INTEGER NOT NULL DEFAULT 0,
  bank_details      JSONB DEFAULT '{}',
  status            affiliate_status NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX idx_affiliates_status ON affiliates(status);

CREATE TABLE affiliate_clicks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id  UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  ip_address    INET,
  user_agent    TEXT,
  referrer      TEXT,
  converted     BOOLEAN NOT NULL DEFAULT FALSE,
  order_id      UUID REFERENCES orders(id) ON DELETE SET NULL,
  commission    NUMERIC(12,2),
  clicked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_affiliate_clicks_affiliate_id ON affiliate_clicks(affiliate_id);

-- =============================================================================
-- TABLE: newsletter_subscribers
-- =============================================================================
CREATE TABLE newsletter_subscribers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        TEXT NOT NULL UNIQUE,
  name         TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(is_active);

-- =============================================================================
-- TABLE: push_subscriptions
-- Web push notification tokens
-- =============================================================================
CREATE TABLE push_subscriptions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint   TEXT NOT NULL UNIQUE,
  keys       JSONB NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- =============================================================================
-- TABLE: settings
-- Key-value system settings store
-- =============================================================================
CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TABLE: audit_logs
-- Security audit trail
-- =============================================================================
CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  table_name TEXT,
  record_id  TEXT,
  old_data   JSONB,
  new_data   JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =============================================================================
-- TABLE: email_templates
-- Dynamic email template store
-- =============================================================================
CREATE TABLE email_templates (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  subject    TEXT NOT NULL,
  html_body  TEXT NOT NULL,
  variables  TEXT[] NOT NULL DEFAULT '{}',
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'addresses', 'categories', 'brands', 'products',
    'product_variants', 'coupons', 'offers', 'carts', 'orders',
    'payments', 'refunds', 'return_requests', 'support_tickets',
    'blog_posts', 'affiliates', 'email_templates'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trigger_update_%I_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  date_part TEXT;
  seq_num   TEXT;
  count_today INTEGER;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO count_today
  FROM orders
  WHERE DATE(created_at) = DATE(NOW());
  seq_num := LPAD(count_today::TEXT, 4, '0');
  NEW.order_number := 'NC-' || date_part || '-' || seq_num;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Generate support ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE count_today INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO count_today
  FROM support_tickets WHERE DATE(created_at) = DATE(NOW());
  NEW.ticket_number := 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(count_today::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL OR NEW.ticket_number = '')
  EXECUTE FUNCTION generate_ticket_number();

-- Update product rating on review change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        AND is_approved = TRUE
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        AND is_approved = TRUE
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Decrement inventory on order
CREATE OR REPLACE FUNCTION reserve_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Only when order status moves to 'confirmed'
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE inventory i
    SET reserved_quantity = reserved_quantity + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND i.variant_id = oi.variant_id;
  END IF;

  -- When order is delivered, deduct from actual stock
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    UPDATE inventory i
    SET
      quantity = quantity - oi.quantity,
      reserved_quantity = reserved_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND i.variant_id = oi.variant_id;

    -- Increment product sold_count
    UPDATE products p
    SET sold_count = sold_count + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id AND p.id = oi.product_id;
  END IF;

  -- Release reservation on cancellation
  IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
    UPDATE inventory i
    SET reserved_quantity = reserved_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND i.variant_id = oi.variant_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_manage_inventory
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION reserve_inventory();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all user-facing tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE compare_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- ── Profile Policies ──────────────────────────────────────────────────────
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Public profiles (display name + avatar)
CREATE POLICY "Public profiles are viewable" ON profiles
  FOR SELECT USING (TRUE)
  WITH CHECK (FALSE);

-- ── Address Policies ──────────────────────────────────────────────────────
CREATE POLICY "Users manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- ── Cart Policies ─────────────────────────────────────────────────────────
CREATE POLICY "Users manage own cart" ON carts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own cart items" ON cart_items
  FOR ALL USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

-- ── Wishlist Policies ─────────────────────────────────────────────────────
CREATE POLICY "Users manage own wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

-- ── Order Policies ────────────────────────────────────────────────────────
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ── Payment Policies ──────────────────────────────────────────────────────
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- ── Review Policies ───────────────────────────────────────────────────────
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Users can manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

-- ── Notification Policies ─────────────────────────────────────────────────
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ── Support Ticket Policies ───────────────────────────────────────────────
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ticket messages" ON ticket_messages
  FOR SELECT USING (
    ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can send ticket messages" ON ticket_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ── Recently Viewed Policies ──────────────────────────────────────────────
CREATE POLICY "Users manage own recently viewed" ON recently_viewed
  FOR ALL USING (auth.uid() = user_id);

-- ── Compare List Policies ─────────────────────────────────────────────────
CREATE POLICY "Users manage own compare list" ON compare_list
  FOR ALL USING (auth.uid() = user_id);

-- ── Affiliate Policies ────────────────────────────────────────────────────
CREATE POLICY "Users can view own affiliate data" ON affiliates
  FOR SELECT USING (auth.uid() = user_id);

-- ── Return Request Policies ───────────────────────────────────────────────
CREATE POLICY "Users can manage own returns" ON return_requests
  FOR ALL USING (auth.uid() = user_id);

-- =============================================================================
-- SEED SYSTEM SETTINGS
-- =============================================================================
INSERT INTO settings (key, value) VALUES
  ('store_name', '"NexCart"'),
  ('store_email', '"support@nexcart.com"'),
  ('store_phone', '"+91-9999999999"'),
  ('currency', '"INR"'),
  ('currency_symbol', '"₹"'),
  ('tax_rate', '18'),
  ('tax_inclusive', 'false'),
  ('free_shipping_threshold', '499'),
  ('default_shipping_charge', '49'),
  ('maintenance_mode', 'false'),
  ('allow_guest_checkout', 'true'),
  ('max_cart_items', '50'),
  ('low_stock_threshold', '5'),
  ('review_approval_required', 'false'),
  ('max_return_days', '7'),
  ('social_links', '{"instagram": "", "twitter": "", "facebook": "", "youtube": ""}')
ON CONFLICT (key) DO NOTHING;
