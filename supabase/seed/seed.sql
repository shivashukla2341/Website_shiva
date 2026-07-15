-- =============================================================================
-- Development seed data. Run with: supabase db reset (applies migrations + this file)
-- Safe to run multiple times (idempotent upserts on natural keys).
-- =============================================================================

insert into categories (name, slug, description, display_order) values
  ('Electronics', 'electronics', 'Phones, laptops, audio and more', 1),
  ('Fashion', 'fashion', 'Clothing, footwear and accessories', 2),
  ('Home & Kitchen', 'home-kitchen', 'Furniture, decor and appliances', 3),
  ('Beauty & Personal Care', 'beauty-personal-care', 'Skincare, makeup and grooming', 4),
  ('Sports & Outdoors', 'sports-outdoors', 'Fitness and outdoor gear', 5)
on conflict (slug) do nothing;

insert into categories (parent_id, name, slug, display_order)
select id, 'Smartphones', 'smartphones', 1 from categories where slug = 'electronics'
on conflict (slug) do nothing;

insert into categories (parent_id, name, slug, display_order)
select id, 'Laptops', 'laptops', 2 from categories where slug = 'electronics'
on conflict (slug) do nothing;

insert into brands (name, slug, description) values
  ('Apex', 'apex', 'Premium consumer electronics'),
  ('Nimbus', 'nimbus', 'Everyday fashion essentials'),
  ('Craftwell', 'craftwell', 'Home goods, thoughtfully made')
on conflict (slug) do nothing;

insert into attributes (name, display_name) values
  ('color', 'Color'),
  ('size', 'Size'),
  ('storage', 'Storage')
on conflict (name) do nothing;

insert into attribute_values (attribute_id, value, display_value, hex_color)
select id, 'black', 'Black', '#000000' from attributes where name = 'color'
on conflict do nothing;

insert into attribute_values (attribute_id, value, display_value, hex_color)
select id, 'silver', 'Silver', '#C0C0C0' from attributes where name = 'color'
on conflict do nothing;

insert into attribute_values (attribute_id, value, display_value)
select id, '128gb', '128GB' from attributes where name = 'storage'
on conflict do nothing;

insert into attribute_values (attribute_id, value, display_value)
select id, '256gb', '256GB' from attributes where name = 'storage'
on conflict do nothing;

-- Sample product with two variants
with new_product as (
  insert into products (category_id, brand_id, name, slug, short_description, description, base_price, compare_at_price, status, is_featured, is_trending, published_at)
  select
    (select id from categories where slug = 'smartphones'),
    (select id from brands where slug = 'apex'),
    'Apex Phone 15 Pro',
    'apex-phone-15-pro',
    'Flagship performance with a pro camera system.',
    'The Apex Phone 15 Pro brings a titanium frame, all-day battery life, and a 48MP pro camera system into a single premium device.',
    79999.00, 89999.00, 'active', true, true, now()
  on conflict (slug) do nothing
  returning id
)
insert into product_variants (product_id, sku, price, stock_quantity, is_default)
select id, 'APEX15PRO-BLK-128', 79999.00, 25, true from new_product
union all
select id, 'APEX15PRO-SLV-256', 89999.00, 15, false from new_product;

insert into product_media (product_id, url, media_type, alt_text, display_order)
select id, 'https://images.example.com/apex-phone-15-pro/front.jpg', 'image', 'Apex Phone 15 Pro front view', 1
from products where slug = 'apex-phone-15-pro'
on conflict do nothing;

insert into coupons (code, description, discount_type, discount_value, min_order_value, usage_limit, per_user_limit)
values ('WELCOME10', 'Get 10% off your first order', 'percentage', 10, 999, 1000, 1)
on conflict (code) do nothing;

insert into site_settings (key, value) values
  ('store_name', '"Website Shiva"'),
  ('support_email', '"support@example.com"'),
  ('currency', '"INR"'),
  ('gst_rate', '18')
on conflict (key) do nothing;

insert into email_templates (key, subject, html_body, description) values
  ('welcome', 'Welcome to {{store_name}}!', '<p>Hi {{full_name}}, welcome aboard!</p>', 'Sent after signup'),
  ('order_confirmation', 'Order {{order_number}} confirmed', '<p>Your order {{order_number}} is confirmed.</p>', 'Sent after checkout'),
  ('otp', 'Your verification code', '<p>Your OTP is {{otp}}. It expires in 10 minutes.</p>', 'OTP verification')
on conflict (key) do nothing;
