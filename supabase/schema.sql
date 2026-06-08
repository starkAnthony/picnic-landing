-- Run in Supabase → SQL Editor → New query → Run

-- Gallery images (owner uploads or keeps static URLs)
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Service plans (admin-managed cards with prices)
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

-- News & events
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  image_url text,
  post_type text not null default 'news' check (post_type in ('news', 'event')),
  event_date date,
  published boolean default true,
  created_at timestamptz default now()
);

-- Contact links (phone, Telegram, Instagram) — editable in /admin
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

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.gallery_items enable row level security;
alter table public.services enable row level security;
alter table public.posts enable row level security;
alter table public.site_settings enable row level security;

-- Everyone can read published content
create policy "Public read gallery"
  on public.gallery_items for select
  to anon, authenticated
  using (true);

create policy "Public read published posts"
  on public.posts for select
  to anon, authenticated
  using (published = true);

create policy "Public read published services"
  on public.services for select
  to anon, authenticated
  using (published = true);

create policy "Public read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- Only logged-in owner can manage
create policy "Auth insert gallery"
  on public.gallery_items for insert to authenticated with check (true);

create policy "Auth update gallery"
  on public.gallery_items for update to authenticated using (true);

create policy "Auth delete gallery"
  on public.gallery_items for delete to authenticated using (true);

create policy "Auth insert site settings"
  on public.site_settings for insert to authenticated with check (true);

create policy "Auth update site settings"
  on public.site_settings for update to authenticated using (true);

create policy "Auth insert services"
  on public.services for insert to authenticated with check (true);

create policy "Auth update services"
  on public.services for update to authenticated using (true);

create policy "Auth delete services"
  on public.services for delete to authenticated using (true);

create policy "Auth insert posts"
  on public.posts for insert to authenticated with check (true);

create policy "Auth update posts"
  on public.posts for update to authenticated using (true);

create policy "Auth delete posts"
  on public.posts for delete to authenticated using (true);

-- Storage bucket: Dashboard → Storage → New bucket → name: gallery → Public ✓
-- Then run supabase/fix-storage-rls.sql (storage RLS is separate from table RLS)

drop policy if exists "gallery public read" on storage.objects;
drop policy if exists "gallery auth upload" on storage.objects;
drop policy if exists "gallery auth update" on storage.objects;
drop policy if exists "gallery auth delete" on storage.objects;

create policy "gallery public read"
  on storage.objects for select to public
  using (bucket_id = 'gallery');

create policy "gallery auth upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery');

create policy "gallery auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'gallery') with check (bucket_id = 'gallery');

create policy "gallery auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'gallery');
