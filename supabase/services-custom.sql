-- Custom / individual ceremony flag on services (run in Supabase SQL Editor)

alter table public.services
  add column if not exists is_custom boolean not null default false;
