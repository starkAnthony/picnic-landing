-- Optional: client-side upload policies (if using direct storage from browser)
-- Recommended: use server upload + SUPABASE_SERVICE_ROLE_KEY (see CONTENT_SETUP.md)

-- 1) Bucket must exist: Storage → New bucket → name exactly: gallery → Public

-- 2) Storage object policies
drop policy if exists "gallery public read" on storage.objects;
drop policy if exists "gallery auth upload" on storage.objects;
drop policy if exists "gallery auth update" on storage.objects;
drop policy if exists "gallery auth delete" on storage.objects;

create policy "gallery public read"
  on storage.objects for select
  to public
  using (bucket_id = 'gallery');

create policy "gallery auth upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

create policy "gallery auth update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery')
  with check (bucket_id = 'gallery');

create policy "gallery auth delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');

-- 3) Table policies
drop policy if exists "Auth insert gallery" on public.gallery_items;
drop policy if exists "Auth update gallery" on public.gallery_items;
drop policy if exists "Auth delete gallery" on public.gallery_items;

create policy "Auth insert gallery"
  on public.gallery_items for insert
  to authenticated
  with check (true);

create policy "Auth update gallery"
  on public.gallery_items for update
  to authenticated
  using (true);

create policy "Auth delete gallery"
  on public.gallery_items for delete
  to authenticated
  using (true);
