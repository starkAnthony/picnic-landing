-- Decor prices (uz/ru/en) — run in Supabase SQL Editor after decors.sql

alter table public.decors
  add column if not exists price_text text,
  add column if not exists price_text_uz text,
  add column if not exists price_text_ru text,
  add column if not exists price_text_en text;

update public.decors
set price_text_uz = coalesce(price_text_uz, price_text, '')
where price_text_uz is null or price_text_uz = '';
