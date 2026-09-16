-- =====================================================================
-- Schema pentru recenzii — rulează în Supabase (SQL Editor).
-- =====================================================================

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  place_id    text not null,
  rating      int  not null check (rating between 1 and 5),
  author_name text not null check (char_length(author_name) between 1 and 80),
  title       text check (title is null or char_length(title) <= 120),
  body        text not null check (char_length(body) between 1 and 4000),
  image_url   text,
  status      text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at  timestamptz not null default now()
);

create index if not exists reviews_place_approved_idx
  on public.reviews (place_id, created_at desc)
  where status = 'approved';

-- Row Level Security
alter table public.reviews enable row level security;

-- Publicul (cheia anon) poate CITI doar recenziile aprobate.
drop policy if exists "read approved reviews" on public.reviews;
create policy "read approved reviews"
  on public.reviews for select
  using (status = 'approved');

-- Nu există politică de INSERT pentru anon: scrierile vin exclusiv prin
-- funcția Netlify, care folosește cheia service_role (bypass RLS).

-- =====================================================================
-- Storage: creează un bucket PUBLIC numit  review-photos
--   Dashboard -> Storage -> New bucket -> name: review-photos -> Public
-- (funcția încarcă pozele acolo cu cheia service_role.)
-- =====================================================================

-- Moderare: aprobi o recenzie schimbând statusul.
--   update public.reviews set status = 'approved' where id = '...';
-- sau din Dashboard -> Table editor -> reviews.
