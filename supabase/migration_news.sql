-- =============================================
-- ALTOKE - Migración: tabla NEWS (noticias)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Separa las noticias del postSlice (foro).
-- =============================================

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  title text not null,
  content text not null default '',
  image text,
  category text not null default 'avisos'
    check (category in ('avisos','eventos','mantenimiento')),
  status text not null default 'publicada'
    check (status in ('publicada','borrador')),
  created_at timestamptz not null default now()
);

alter table public.news enable row level security;

drop policy if exists "news_select" on public.news;
create policy "news_select" on public.news
  for select using (
    public.is_member(community_id)
    or exists (
      select 1 from public.communities
      where id = community_id and owner_id = auth.uid()
    )
  );

drop policy if exists "news_insert_own" on public.news;
create policy "news_insert_own" on public.news
  for insert with check (
    user_id = auth.uid()
    and (
      public.is_member(community_id)
      or exists (
        select 1 from public.communities
        where id = community_id and owner_id = auth.uid()
      )
    )
  );

drop policy if exists "news_update_author_admin" on public.news;
create policy "news_update_author_admin" on public.news
  for update using (
    user_id = auth.uid() or public.is_community_admin(community_id)
  );

drop policy if exists "news_delete_admin_or_author" on public.news;
create policy "news_delete_admin_or_author" on public.news
  for delete using (
    user_id = auth.uid() or public.is_community_admin(community_id)
  );