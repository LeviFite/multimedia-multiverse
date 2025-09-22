
-- Threads table + RLS
create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  category text not null,
  author_id uuid not null,
  author_name text,
  replies int not null default 0,
  created_at timestamp with time zone default now()
);
alter table public.threads enable row level security;
create policy "read threads" on public.threads for select using ( true );
create policy "insert own threads" on public.threads for insert with check ( auth.uid() = author_id );

-- Storage bucket 'media' should be created in the dashboard (public read).
-- Add policies to allow authenticated users to upload to paths prefixed with their uid.
