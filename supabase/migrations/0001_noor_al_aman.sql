create extension if not exists pgcrypto;

create table if not exists public.programs (
  id text primary key,
  slug text not null unique,
  title text not null,
  short_title text not null,
  summary text not null default '',
  image text not null,
  image_alt text not null default '',
  video text not null default '',
  gallery_json jsonb not null default '[]'::jsonb,
  label text not null default '',
  eyebrow text not null default '',
  lead text not null default '',
  body text not null default '',
  bullets_json jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  published_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.site_content (
  key text primary key,
  draft_value text not null default '',
  published_value text not null default '',
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  object_key text not null unique,
  name text not null,
  content_type text not null,
  size bigint not null,
  alt_text text not null default '',
  public_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists programs_public_order_idx
  on public.programs (is_published, sort_order);
create index if not exists media_created_at_idx
  on public.media (created_at desc);
create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.programs enable row level security;
alter table public.site_content enable row level security;
alter table public.media enable row level security;
alter table public.contact_submissions enable row level security;

drop policy if exists "Public can read published programs" on public.programs;
create policy "Public can read published programs"
  on public.programs for select
  using (is_published = true);

drop policy if exists "Public can read published content" on public.site_content;
create policy "Public can read published content"
  on public.site_content for select
  using (true);

drop policy if exists "Public can read media metadata" on public.media;
create policy "Public can read media metadata"
  on public.media for select
  using (true);

insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)
on conflict (id) do update
set public = true, file_size_limit = 52428800;
