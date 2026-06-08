-- Run in Supabase SQL Editor — adds uz/ru/en fields to services

alter table public.services add column if not exists name_uz text;
alter table public.services add column if not exists name_ru text;
alter table public.services add column if not exists name_en text;
alter table public.services add column if not exists description_uz text;
alter table public.services add column if not exists description_ru text;
alter table public.services add column if not exists description_en text;
alter table public.services add column if not exists price_text_uz text;
alter table public.services add column if not exists price_text_ru text;
alter table public.services add column if not exists price_text_en text;
alter table public.services add column if not exists features_uz text[] default '{}';
alter table public.services add column if not exists features_ru text[] default '{}';
alter table public.services add column if not exists features_en text[] default '{}';

-- Copy existing single-language data into all locales (edit in admin later)
update public.services
set
  name_uz = coalesce(name_uz, name),
  name_ru = coalesce(name_ru, name),
  name_en = coalesce(name_en, name),
  description_uz = coalesce(description_uz, description),
  description_ru = coalesce(description_ru, description),
  description_en = coalesce(description_en, description),
  price_text_uz = coalesce(price_text_uz, price_text),
  price_text_ru = coalesce(price_text_ru, price_text),
  price_text_en = coalesce(price_text_en, price_text),
  features_uz = case when features_uz = '{}' or features_uz is null then features else features_uz end,
  features_ru = case when features_ru = '{}' or features_ru is null then features else features_ru end,
  features_en = case when features_en = '{}' or features_en is null then features else features_en end
where name is not null;
