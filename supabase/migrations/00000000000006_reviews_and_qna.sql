-- =============================================================================
-- Migration: Reviews, Ratings, Q&A
-- =============================================================================

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  order_item_id uuid,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text,
  is_verified_purchase boolean not null default false,
  is_approved boolean not null default true,
  helpful_count integer not null default 0,
  ai_summary_included boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, user_id, order_item_id)
);

create index idx_reviews_product_id on reviews(product_id);
create index idx_reviews_user_id on reviews(user_id);
create index idx_reviews_rating on reviews(rating);

create trigger trg_reviews_updated_at
  before update on reviews
  for each row execute function set_updated_at();

create table review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  url text not null,
  display_order integer not null default 0
);

create index idx_review_images_review_id on review_images(review_id);

create table review_votes (
  review_id uuid not null references reviews(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  is_helpful boolean not null,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);

-- Keep review.helpful_count and product.avg_rating/review_count in sync.
create or replace function refresh_review_helpful_count()
returns trigger
language plpgsql
as $$
begin
  update reviews
  set helpful_count = (
    select count(*) from review_votes rv
    where rv.review_id = coalesce(new.review_id, old.review_id) and rv.is_helpful
  )
  where id = coalesce(new.review_id, old.review_id);
  return coalesce(new, old);
end;
$$;

create trigger trg_review_votes_sync
  after insert or update or delete on review_votes
  for each row execute function refresh_review_helpful_count();

create or replace function refresh_product_rating()
returns trigger
language plpgsql
as $$
declare
  target_product_id uuid := coalesce(new.product_id, old.product_id);
begin
  update products
  set
    avg_rating = coalesce((
      select round(avg(rating)::numeric, 2) from reviews
      where product_id = target_product_id and is_approved
    ), 0),
    review_count = (
      select count(*) from reviews
      where product_id = target_product_id and is_approved
    )
  where id = target_product_id;
  return coalesce(new, old);
end;
$$;

create trigger trg_reviews_sync_product_rating
  after insert or update or delete on reviews
  for each row execute function refresh_product_rating();

-- ---------------------------------------------------------------------------
-- Questions & Answers
-- ---------------------------------------------------------------------------

create table product_questions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  question text not null,
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_product_questions_product_id on product_questions(product_id);

create table product_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references product_questions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  answer text not null,
  is_seller_answer boolean not null default false,
  helpful_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_product_answers_question_id on product_answers(question_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table reviews enable row level security;
alter table review_images enable row level security;
alter table review_votes enable row level security;
alter table product_questions enable row level security;
alter table product_answers enable row level security;

create policy "reviews_public_read"
  on reviews for select using (is_approved or auth.uid() = user_id or is_staff(auth.uid()));

create policy "reviews_owner_write"
  on reviews for insert with check (auth.uid() = user_id);

create policy "reviews_owner_update"
  on reviews for update using (auth.uid() = user_id or is_staff(auth.uid()));

create policy "reviews_owner_delete"
  on reviews for delete using (auth.uid() = user_id or is_staff(auth.uid()));

create policy "review_images_public_read" on review_images for select using (true);
create policy "review_images_owner_write" on review_images for insert
  with check (exists (select 1 from reviews r where r.id = review_id and r.user_id = auth.uid()));
create policy "review_images_owner_delete" on review_images for delete
  using (exists (select 1 from reviews r where r.id = review_id and r.user_id = auth.uid()) or is_staff(auth.uid()));

create policy "review_votes_public_read" on review_votes for select using (true);
create policy "review_votes_owner_write" on review_votes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "questions_public_read" on product_questions for select
  using (is_approved or auth.uid() = user_id or is_staff(auth.uid()));
create policy "questions_owner_write" on product_questions for insert
  with check (auth.uid() = user_id);
create policy "questions_owner_delete" on product_questions for delete
  using (auth.uid() = user_id or is_staff(auth.uid()));

create policy "answers_public_read" on product_answers for select using (true);
create policy "answers_owner_write" on product_answers for insert
  with check (auth.uid() = user_id);
create policy "answers_owner_delete" on product_answers for delete
  using (auth.uid() = user_id or is_staff(auth.uid()));
