-- =============================================
-- ALTOKE - Migración: códigos de unión + admin memberships
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- 0) EL DUEÑO TAMBIÉN CUENTA COMO "ADMIN" PARA GESTIONAR SU COMUNIDAD
create or replace function public.is_community_admin(cid uuid)
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where community_id = cid and user_id = auth.uid() and role = 'admin'
  )
  or exists (
    select 1 from public.communities
    where id = cid and owner_id = auth.uid()
  );
$$;

-- 1) CÓDIGO DE UNIÓN ÚNICO POR COMUNIDAD
alter table public.communities
  add column if not exists code text;

update public.communities
set code = upper(substr(md5(id::text || clock_timestamp()::text), 1, 6))
where code is null;

alter table public.communities
  alter column code set not null;

create unique index if not exists communities_code_key
  on public.communities (code);

-- 2) EL ADMIN PUEDE AGREGAR / QUITAR MIEMBROS
drop policy if exists "memberships_insert_own" on public.memberships;
create policy "memberships_insert_own" on public.memberships
  for insert with check (user_id = auth.uid() or public.is_community_admin(community_id));

drop policy if exists "memberships_delete_own" on public.memberships;
create policy "memberships_delete_own" on public.memberships
  for delete using (user_id = auth.uid() or public.is_community_admin(community_id));