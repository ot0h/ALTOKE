-- =============================================
-- ALTOKE - Migración: bucket REPORT-PHOTOS (evidencias de reportes)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Crea el bucket público + políticas RLS.
-- Ruta de archivos dentro del bucket: reportes/img-<timestamp>.<ext>
-- =============================================

insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do update set public = true;

-- Cualquier usuario autenticado puede ver las evidencias (públicas)
drop policy if exists "report_photos_public_read" on storage.objects;
create policy "report_photos_public_read" on storage.objects
  for select using (bucket_id = 'report-photos');

-- Los usuarios autenticados pueden subir evidencias de reportes
drop policy if exists "report_photos_authenticated_insert" on storage.objects;
create policy "report_photos_authenticated_insert" on storage.objects
  for insert with check (
    bucket_id = 'report-photos'
    and auth.role() = 'authenticated'
  );

drop policy if exists "report_photos_authenticated_update" on storage.objects;
create policy "report_photos_authenticated_update" on storage.objects
  for update using (bucket_id = 'report-photos' and auth.role() = 'authenticated');

drop policy if exists "report_photos_authenticated_delete" on storage.objects;
create policy "report_photos_authenticated_delete" on storage.objects
  for delete using (bucket_id = 'report-photos' and auth.role() = 'authenticated');