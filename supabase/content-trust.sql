-- Testimonials, FAQ, and how-it-works step images (run in Supabase SQL Editor)

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quote_uz text not null,
  quote_ru text,
  quote_en text,
  occasion_uz text not null default '',
  occasion_ru text,
  occasion_en text,
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question_uz text not null,
  question_ru text,
  question_en text,
  answer_uz text not null,
  answer_ru text,
  answer_en text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz default now()
);

alter table public.site_settings
  add column if not exists how_step_1_image_url text,
  add column if not exists how_step_2_image_url text,
  add column if not exists how_step_3_image_url text;

alter table public.testimonials enable row level security;
alter table public.faq_items enable row level security;

drop policy if exists "Public read published testimonials" on public.testimonials;
create policy "Public read published testimonials"
  on public.testimonials for select to anon, authenticated using (published = true);

drop policy if exists "Auth insert testimonials" on public.testimonials;
create policy "Auth insert testimonials" on public.testimonials for insert to authenticated with check (true);

drop policy if exists "Auth update testimonials" on public.testimonials;
create policy "Auth update testimonials" on public.testimonials for update to authenticated using (true);

drop policy if exists "Auth delete testimonials" on public.testimonials;
create policy "Auth delete testimonials" on public.testimonials for delete to authenticated using (true);

drop policy if exists "Public read published faq" on public.faq_items;
create policy "Public read published faq"
  on public.faq_items for select to anon, authenticated using (published = true);

drop policy if exists "Auth insert faq" on public.faq_items;
create policy "Auth insert faq" on public.faq_items for insert to authenticated with check (true);

drop policy if exists "Auth update faq" on public.faq_items;
create policy "Auth update faq" on public.faq_items for update to authenticated using (true);

drop policy if exists "Auth delete faq" on public.faq_items;
create policy "Auth delete faq" on public.faq_items for delete to authenticated using (true);
