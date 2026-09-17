-- =============================================
-- ALTOKE - Supabase Schema
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- PROFILES (1:1 con auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null,
  avatar text,
  created_at timestamptz not null default now()
);

-- Trigger: crea el profile automaticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.email),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- COMMUNITIES
-- ------------------------------------------------------------
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  address text not null default '',
  image text,
  rules text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MEMBERSHIPS
-- ------------------------------------------------------------
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  role text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz not null default now(),
  unique (user_id, community_id)
);

-- ------------------------------------------------------------
-- HELPERS para RLS (van despues de memberships; con security
-- definer evitan recursion de RLS)
-- ------------------------------------------------------------
create or replace function public.is_member(cid uuid)
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where community_id = cid and user_id = auth.uid()
  );
$$;

create or replace function public.is_community_admin(cid uuid)
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where community_id = cid and user_id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  name text not null,
  type text not null check (type in ('report','news'))
);

-- ------------------------------------------------------------
-- REPORTS
-- ------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default '',
  location text,
  status text not null default 'revision'
    check (status in ('revision','pendiente','proceso','resuelto')),
  user_id uuid not null references auth.users(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  fotos text[],
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- POSTS (foro / avisos)
-- ------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  title text not null,
  content text not null default '',
  image text,
  category text check (category in ('avisos','eventos','mantenimiento')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- POST_LIKES
-- ------------------------------------------------------------
create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

-- ------------------------------------------------------------
-- COMMENTS
-- ------------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.memberships enable row level security;
alter table public.categories enable row level security;
alter table public.reports enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.comments enable row level security;

-- PROFILES
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.role() = 'authenticated');
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- COMMUNITIES
drop policy if exists "communities_select" on public.communities;
create policy "communities_select" on public.communities
  for select using (auth.role() = 'authenticated');
drop policy if exists "communities_insert" on public.communities;
create policy "communities_insert" on public.communities
  for insert with check (owner_id = auth.uid());
drop policy if exists "communities_update_owner" on public.communities;
create policy "communities_update_owner" on public.communities
  for update using (owner_id = auth.uid());
drop policy if exists "communities_delete_owner" on public.communities;
create policy "communities_delete_owner" on public.communities
  for delete using (owner_id = auth.uid());

-- MEMBERSHIPS
drop policy if exists "memberships_select" on public.memberships;
create policy "memberships_select" on public.memberships
  for select using (user_id = auth.uid() or public.is_community_admin(community_id));
drop policy if exists "memberships_insert_own" on public.memberships;
create policy "memberships_insert_own" on public.memberships
  for insert with check (user_id = auth.uid());
drop policy if exists "memberships_update_admin" on public.memberships;
create policy "memberships_update_admin" on public.memberships
  for update using (public.is_community_admin(community_id));
drop policy if exists "memberships_delete_own" on public.memberships;
create policy "memberships_delete_own" on public.memberships
  for delete using (user_id = auth.uid());

-- CATEGORIES
drop policy if exists "categories_select" on public.categories;
create policy "categories_select" on public.categories
  for select using (auth.role() = 'authenticated');
drop policy if exists "categories_insert_admin" on public.categories;
create policy "categories_insert_admin" on public.categories
  for insert with check (public.is_community_admin(community_id));
drop policy if exists "categories_update_admin" on public.categories;
create policy "categories_update_admin" on public.categories
  for update using (public.is_community_admin(community_id));
drop policy if exists "categories_delete_admin" on public.categories;
create policy "categories_delete_admin" on public.categories
  for delete using (public.is_community_admin(community_id));

-- REPORTS
drop policy if exists "reports_select" on public.reports;
create policy "reports_select" on public.reports
  for select using (auth.role() = 'authenticated');
drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
  for insert with check (user_id = auth.uid());
drop policy if exists "reports_update_admin_or_author" on public.reports;
create policy "reports_update_admin_or_author" on public.reports
  for update using (user_id = auth.uid() or public.is_community_admin(community_id));
drop policy if exists "reports_delete_admin_or_author" on public.reports;
create policy "reports_delete_admin_or_author" on public.reports
  for delete using (user_id = auth.uid() or public.is_community_admin(community_id));

-- POSTS
drop policy if exists "posts_select" on public.posts;
create policy "posts_select" on public.posts
  for select using (auth.role() = 'authenticated');
drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own" on public.posts
  for insert with check (user_id = auth.uid());
drop policy if exists "posts_update_author_admin" on public.posts;
create policy "posts_update_author_admin" on public.posts
  for update using (user_id = auth.uid() or public.is_community_admin(community_id));
drop policy if exists "posts_delete_admin_or_author" on public.posts;
create policy "posts_delete_admin_or_author" on public.posts
  for delete using (user_id = auth.uid() or public.is_community_admin(community_id));

-- POST_LIKES
drop policy if exists "post_likes_select" on public.post_likes;
create policy "post_likes_select" on public.post_likes
  for select using (auth.role() = 'authenticated');
drop policy if exists "post_likes_insert_own" on public.post_likes;
create policy "post_likes_insert_own" on public.post_likes
  for insert with check (user_id = auth.uid());
drop policy if exists "post_likes_delete_own" on public.post_likes;
create policy "post_likes_delete_own" on public.post_likes
  for delete using (user_id = auth.uid());

-- COMMENTS
drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments
  for select using (auth.role() = 'authenticated');
drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own" on public.comments
  for insert with check (user_id = auth.uid());
drop policy if exists "comments_delete_author" on public.comments;
create policy "comments_delete_author" on public.comments
  for delete using (user_id = auth.uid());