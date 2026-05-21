-- Run in Supabase → SQL Editor → New query → Run

-- Gallery images (owner uploads or keeps static URLs)
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text default '',
  sort_order int default 0,
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

alter table public.gallery_items enable row level security;
alter table public.posts enable row level security;

-- Everyone can read published content
create policy "Public read gallery"
  on public.gallery_items for select
  to anon, authenticated
  using (true);

create policy "Public read published posts"
  on public.posts for select
  to anon, authenticated
  using (published = true);

-- Only logged-in owner can manage
create policy "Auth insert gallery"
  on public.gallery_items for insert to authenticated with check (true);

create policy "Auth update gallery"
  on public.gallery_items for update to authenticated using (true);

create policy "Auth delete gallery"
  on public.gallery_items for delete to authenticated using (true);

create policy "Auth insert posts"
  on public.posts for insert to authenticated with check (true);

create policy "Auth update posts"
  on public.posts for update to authenticated using (true);

create policy "Auth delete posts"
  on public.posts for delete to authenticated using (true);

-- Storage bucket: create "gallery" in Dashboard → Storage → New bucket → Public
-- Policy: public read, authenticated upload
