-- =============================================================================
-- Migration: Blog & CMS Pages
-- =============================================================================

create table blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete set null,
  category_id uuid references blog_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  status content_status not null default 'draft',
  tags text[] not null default '{}',
  meta_title text,
  meta_description text,
  view_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_blog_posts_category_id on blog_posts(category_id);
create index idx_blog_posts_status on blog_posts(status);
create index idx_blog_posts_slug on blog_posts(slug);
create index idx_blog_posts_published_at on blog_posts(published_at desc);

create trigger trg_blog_posts_updated_at
  before update on blog_posts
  for each row execute function set_updated_at();

-- Generic CMS pages (About, Careers, Affiliate Program, etc.) so admins can
-- edit marketing copy without a deploy.
create table cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  status content_status not null default 'published',
  meta_title text,
  meta_description text,
  updated_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_cms_pages_updated_at
  before update on cms_pages
  for each row execute function set_updated_at();

alter table blog_categories enable row level security;
alter table blog_posts enable row level security;
alter table cms_pages enable row level security;

create policy "blog_categories_public_read" on blog_categories for select using (true);
create policy "blog_categories_admin_write" on blog_categories for insert with check (is_staff(auth.uid()));
create policy "blog_categories_admin_update" on blog_categories for update using (is_staff(auth.uid()));
create policy "blog_categories_admin_delete" on blog_categories for delete using (is_staff(auth.uid()));

create policy "blog_posts_public_read"
  on blog_posts for select using (status = 'published' or is_staff(auth.uid()));
create policy "blog_posts_admin_write" on blog_posts for insert with check (is_staff(auth.uid()));
create policy "blog_posts_admin_update" on blog_posts for update using (is_staff(auth.uid()));
create policy "blog_posts_admin_delete" on blog_posts for delete using (is_staff(auth.uid()));

create policy "cms_pages_public_read"
  on cms_pages for select using (status = 'published' or is_staff(auth.uid()));
create policy "cms_pages_admin_write" on cms_pages for insert with check (is_staff(auth.uid()));
create policy "cms_pages_admin_update" on cms_pages for update using (is_staff(auth.uid()));
create policy "cms_pages_admin_delete" on cms_pages for delete using (is_staff(auth.uid()));
