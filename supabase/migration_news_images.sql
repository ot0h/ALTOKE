-- =============================================
-- ALTOKE - Migración: bucket NEWS (imágenes de portada)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Crea el bucket público + políticas RLS.
-- Ruta de archivos dentro del bucket: <community_id>/img-<timestamp>.<ext>
-- =============================================

insert into storage.buckets (id, name, public)
values ('news', 'news', true)
on conflict (id) do update set public = true;

-- Cualquier usuario autenticado puede ver las imágenes de portada (públicas)
drop policy if exists "news_images_public_read" on storage.objects;
create policy "news_images_public_read" on storage.objects
  for select using (bucket_id = 'news');

-- Los usuarios autenticados pueden subir imágenes de noticias
drop policy if exists "news_images_authenticated_insert" on storage.objects;
create policy "news_images_authenticated_insert" on storage.objects
  for insert with check (
    bucket_id = 'news'
    and auth.role() = 'authenticated'
  );

drop policy if exists "news_images_authenticated_update" on storage.objects;
create policy "news_images_authenticated_update" on storage.objects
  for update using (bucket_id = 'news' and auth.role() = 'authenticated');

drop policy if exists "news_images_authenticated_delete" on storage.objects;
create policy "news_images_authenticated_delete" on storage.objects
  for delete using (bucket_id = 'news' and auth.role() = 'authenticated');