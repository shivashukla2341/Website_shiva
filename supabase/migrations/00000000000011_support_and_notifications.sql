-- =============================================================================
-- Migration: Support Tickets & Notifications
-- =============================================================================

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  subject text not null,
  status ticket_status not null default 'open',
  priority ticket_priority not null default 'medium',
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_support_tickets_user_id on support_tickets(user_id);
create index idx_support_tickets_status on support_tickets(status);
create index idx_support_tickets_assigned_to on support_tickets(assigned_to);

create trigger trg_support_tickets_updated_at
  before update on support_tickets
  for each row execute function set_updated_at();

create table support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references support_tickets(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  attachment_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_support_messages_ticket_id on support_messages(ticket_id, created_at);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_id on notifications(user_id, is_read, created_at desc);

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table support_tickets enable row level security;
alter table support_messages enable row level security;
alter table notifications enable row level security;
alter table newsletter_subscribers enable row level security;

create policy "support_tickets_owner_read"
  on support_tickets for select using (auth.uid() = user_id or is_staff(auth.uid()));
create policy "support_tickets_owner_insert"
  on support_tickets for insert with check (auth.uid() = user_id);
create policy "support_tickets_staff_update"
  on support_tickets for update using (is_staff(auth.uid()));

create policy "support_messages_participant_read"
  on support_messages for select
  using (is_staff(auth.uid()) or exists (
    select 1 from support_tickets t where t.id = ticket_id and t.user_id = auth.uid()
  ));
create policy "support_messages_participant_write"
  on support_messages for insert
  with check (sender_id = auth.uid() and (is_staff(auth.uid()) or exists (
    select 1 from support_tickets t where t.id = ticket_id and t.user_id = auth.uid()
  )));

create policy "notifications_owner_full_access"
  on notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "newsletter_public_insert"
  on newsletter_subscribers for insert with check (true);
create policy "newsletter_admin_read"
  on newsletter_subscribers for select using (is_staff(auth.uid()));
create policy "newsletter_admin_update"
  on newsletter_subscribers for update using (is_staff(auth.uid()));
