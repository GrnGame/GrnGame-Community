-- this is the sql put in supabase
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 5 and 50),
  description text not null check (char_length(description) between 30 and 500),
  author text not null check (char_length(author) between 5 and 50),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '1 month'
);

alter table games enable row level security;

drop policy if exists "read active games" on games;
create policy "read active games" on games
  for select using (expires_at > now());

drop policy if exists "anyone can add a game" on games;
create policy "anyone can add a game" on games
  for insert to anon with check (true);

revoke insert on games from anon;
grant insert (id, title, description, author) on games to anon;
grant select on games to anon;

--size limit 50 Mo et 20 Mo
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('paks',   'paks',   true, 52428800, null),
  ('videos', 'videos', true, 20971520, array['video/*'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "upload paks" on storage.objects;
create policy "upload paks" on storage.objects
  for insert to anon with check (bucket_id = 'paks');

drop policy if exists "upload videos" on storage.objects;
create policy "upload videos" on storage.objects
  for insert to anon with check (bucket_id = 'videos');