-- Optional add-on décors for services (run in Supabase SQL Editor)

create table if not exists public.decors (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  name_uz text not null,
  name_ru text,
  name_en text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz default now()
);

-- Which services can use each decor (empty = all services)
create table if not exists public.service_decors (
  service_id uuid not null references public.services(id) on delete cascade,
  decor_id uuid not null references public.decors(id) on delete cascade,
  primary key (service_id, decor_id)
);

alter table public.decors enable row level security;
alter table public.service_decors enable row level security;

drop policy if exists "Public read published decors" on public.decors;
create policy "Public read published decors"
  on public.decors for select
  to anon, authenticated
  using (published = true);

drop policy if exists "Public read service decors" on public.service_decors;
create policy "Public read service decors"
  on public.service_decors for select
  to anon, authenticated
  using (true);

drop policy if exists "Auth insert decors" on public.decors;
create policy "Auth insert decors"
  on public.decors for insert to authenticated with check (true);

drop policy if exists "Auth update decors" on public.decors;
create policy "Auth update decors"
  on public.decors for update to authenticated using (true);

drop policy if exists "Auth delete decors" on public.decors;
create policy "Auth delete decors"
  on public.decors for delete to authenticated using (true);

drop policy if exists "Auth insert service decors" on public.service_decors;
create policy "Auth insert service decors"
  on public.service_decors for insert to authenticated with check (true);

drop policy if exists "Auth delete service decors" on public.service_decors;
create policy "Auth delete service decors"
  on public.service_decors for delete to authenticated using (true);
