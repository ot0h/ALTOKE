-- =====================================================================
-- MIGRACIÓN: tabla report_notes (notas/anotaciones sobre reportes)
-- Ejecutar en Supabase SQL Editor
-- =====================================================================

create table if not exists public.report_notes (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.report_notes enable row level security;

drop policy if exists "report_notes_select" on public.report_notes;
create policy "report_notes_select" on public.report_notes
  for select using (auth.role() = 'authenticated');

drop policy if exists "report_notes_insert" on public.report_notes;
create policy "report_notes_insert" on public.report_notes
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.reports
      where reports.id = report_id
        and public.is_community_admin(reports.community_id)
    )
  );

drop policy if exists "report_notes_delete_author" on public.report_notes;
create policy "report_notes_delete_author" on public.report_notes
  for delete using (user_id = auth.uid());