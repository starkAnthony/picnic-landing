-- Creates site_settings (if missing) OR adds hero_image_url column (if table exists).
-- Safe to run anytime in Supabase SQL Editor.

create table if not exists public.site_settings (
  id int primary key default 1,
  phone_display text not null default '+998 99 442 60 30',
  telegram_username text not null default 'tony_not',
  instagram_handle text not null default 'sevinc_picnic',
  instagram_url text,
  hero_image_url text,
  updated_at timestamptz default now(),
  constraint site_settings_single_row check (id = 1)
);

alter table public.site_settings
  add column if not exists hero_image_url text;

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
drop policy if exists "Auth upsert site settings" on public.site_settings;
drop policy if exists "Auth insert site settings" on public.site_settings;
drop policy if exists "Auth update site settings" on public.site_settings;

create policy "Public read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Auth insert site settings"
  on public.site_settings for insert to authenticated with check (true);

create policy "Auth update site settings"
  on public.site_settings for update to authenticated using (true);
