-- Run in Supabase SQL Editor if schema.sql was already applied earlier

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price_text text not null default '',
  price_amount numeric,
  features text[] not null default '{}',
  is_popular boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz default now()
);

alter table public.services enable row level security;

drop policy if exists "Public read published services" on public.services;
drop policy if exists "Auth insert services" on public.services;
drop policy if exists "Auth update services" on public.services;
drop policy if exists "Auth delete services" on public.services;

create policy "Public read published services"
  on public.services for select
  to anon, authenticated
  using (published = true);

create policy "Auth insert services"
  on public.services for insert to authenticated with check (true);

create policy "Auth update services"
  on public.services for update to authenticated using (true);

create policy "Auth delete services"
  on public.services for delete to authenticated using (true);
