-- Run this once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run.
-- Creates the per-user data table and locks it down so each person can only ever
-- read or write their OWN rows (Row Level Security).

create table if not exists public.app_state (
  user_id    uuid not null references auth.users(id) on delete cascade,
  key        text not null,
  value      text,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.app_state enable row level security;

-- A user can only touch rows where user_id = their own auth id.
create policy "app_state_select" on public.app_state
  for select using (auth.uid() = user_id);
create policy "app_state_insert" on public.app_state
  for insert with check (auth.uid() = user_id);
create policy "app_state_update" on public.app_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "app_state_delete" on public.app_state
  for delete using (auth.uid() = user_id);
