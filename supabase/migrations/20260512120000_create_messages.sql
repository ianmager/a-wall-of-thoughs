-- Messages wall: one row per post. Run in Supabase SQL Editor (see README).
-- Dev reset: uncomment DROP TABLE at the bottom, run, then run this whole script again.

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz null,
  constraint messages_body_length check (
    char_length(trim(body)) > 0
    and char_length(body) <= 500
  )
);

comment on table public.messages is 'Public wall posts; RLS controls read/write.';

create index messages_created_at_idx on public.messages (created_at asc);
create index messages_user_id_idx on public.messages (user_id);
create index messages_deleted_at_idx on public.messages (deleted_at) where deleted_at is null;

alter table public.messages enable row level security;

-- Anyone (including anonymous visitors) can read rows that are not soft-deleted.
create policy "messages_select_public"
  on public.messages
  for select
  to anon, authenticated
  using (deleted_at is null);

-- Signed-in users may insert only their own row; body length enforced by CHECK.
create policy "messages_insert_own"
  on public.messages
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- No UPDATE / DELETE for anon or authenticated here (admin will use service role or future policies).

grant select on table public.messages to anon, authenticated;
grant insert on table public.messages to authenticated;

-- Optional dev reset (uncomment, run, then re-run full migration):
-- drop table if exists public.messages cascade;
