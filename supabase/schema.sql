-- FBLA Member Portal — run in Supabase SQL Editor (Dashboard → SQL)
-- https://supabase.com/dashboard/project/cttncecgjgxrttvwqmuq/sql
-- Fresh install: includes member_profiles + RLS (see migrations/002_accounts.sql)

create table if not exists public.chapters (
  session_id text primary key,
  chapter_key text,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  uid text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.member_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  email text not null,
  role text not null default 'member' check (role in ('member', 'officer', 'admin')),
  photo_url text,
  points integer not null default 0,
  competition_points integer not null default 0,
  achievements jsonb not null default '[]'::jsonb,
  registered_event_ids jsonb not null default '[]'::jsonb,
  entered_competition_ids jsonb not null default '[]'::jsonb,
  competition_placements jsonb not null default '{}'::jsonb,
  points_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chapters_updated_at_idx on public.chapters (updated_at desc);
create index if not exists profiles_updated_at_idx on public.profiles (updated_at desc);
create index if not exists member_profiles_email_idx on public.member_profiles (email);

insert into public.chapters (session_id, chapter_key, payload)
values (
  'default',
  'default',
  '{"events":[],"competitions":[],"leaderboard":[],"activities":[]}'::jsonb
)
on conflict (session_id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_profiles (id, display_name, email, photo_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.chapters enable row level security;
alter table public.profiles enable row level security;
alter table public.member_profiles enable row level security;

drop policy if exists "chapters_anon_all" on public.chapters;
drop policy if exists "profiles_anon_all" on public.profiles;
drop policy if exists "member_profiles_select_own" on public.member_profiles;
drop policy if exists "member_profiles_update_own" on public.member_profiles;
drop policy if exists "member_profiles_insert_own" on public.member_profiles;
drop policy if exists "member_profiles_select_authenticated" on public.member_profiles;
drop policy if exists "chapters_select_authenticated" on public.chapters;
drop policy if exists "chapters_write_authenticated" on public.chapters;
drop policy if exists "profiles_legacy_read" on public.profiles;

create policy "member_profiles_select_own"
  on public.member_profiles for select
  to authenticated
  using (id = auth.uid());

create policy "member_profiles_update_own"
  on public.member_profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "member_profiles_insert_own"
  on public.member_profiles for insert
  to authenticated
  with check (id = auth.uid());

create policy "member_profiles_select_authenticated"
  on public.member_profiles for select
  to authenticated
  using (true);

create policy "chapters_select_authenticated"
  on public.chapters for select
  to authenticated
  using (true);

create policy "chapters_write_authenticated"
  on public.chapters for all
  to authenticated
  using (true)
  with check (true);

create policy "profiles_legacy_read"
  on public.profiles for select
  to authenticated
  using (true);
