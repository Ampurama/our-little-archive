create table if not exists public.couple_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  access_level text not null default 'editor'
);

alter table public.couple_members
  add column if not exists access_level text not null default 'editor';

alter table public.couple_members enable row level security;

drop policy if exists "members can read own membership" on public.couple_members;
create policy "members can read own membership"
  on public.couple_members
  for select
  to authenticated
  using (auth.uid() = user_id);

create table if not exists public.couple_state (
  state_key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.couple_state enable row level security;

drop policy if exists "couple can read shared state" on public.couple_state;
create policy "couple can read shared state"
  on public.couple_state
  for select
  to authenticated
  using (exists (select 1 from public.couple_members where user_id = auth.uid()));

drop policy if exists "couple can insert shared state" on public.couple_state;
create policy "couple can insert shared state"
  on public.couple_state
  for insert
  to authenticated
  with check (exists (select 1 from public.couple_members where user_id = auth.uid() and access_level = 'editor'));

drop policy if exists "couple can update shared state" on public.couple_state;
create policy "couple can update shared state"
  on public.couple_state
  for update
  to authenticated
  using (exists (select 1 from public.couple_members where user_id = auth.uid() and access_level = 'editor'))
  with check (exists (select 1 from public.couple_members where user_id = auth.uid() and access_level = 'editor'));

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'couple_state'
  ) then
    alter publication supabase_realtime add table public.couple_state;
  end if;
end
$$;

-- Jalankan setelah ketiga akun magic-link dibuat dari aplikasi.
-- Ainun ditambahkan sebagai viewer; dua akun utama tetap editor.
insert into public.couple_members (user_id, access_level)
select id,
  case when lower(email) = 'einundhiyaa10@gmail.com' then 'viewer' else 'editor' end
from auth.users
where lower(email) in ('ampuramar@gmail.com', 'utarianisadwi17@gmail.com', 'einundhiyaa10@gmail.com')
on conflict (user_id) do update set access_level = excluded.access_level;
