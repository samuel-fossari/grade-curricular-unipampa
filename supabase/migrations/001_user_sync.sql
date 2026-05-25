-- Snapshot de dados do usuário (formato GRADE_STORAGE.exportAll()).
-- Executar no Supabase: SQL Editor → New query → Run.

create table if not exists public.user_sync_snapshots (
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id)
);

comment on table public.user_sync_snapshots is
  'Backup JSON por usuário — progresso, CCCGs, horários, preferências.';

alter table public.user_sync_snapshots enable row level security;

create policy "select own snapshot"
  on public.user_sync_snapshots
  for select
  using (auth.uid() = user_id);

create policy "insert own snapshot"
  on public.user_sync_snapshots
  for insert
  with check (auth.uid() = user_id);

create policy "update own snapshot"
  on public.user_sync_snapshots
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_sync_snapshots_updated_at on public.user_sync_snapshots;

create trigger user_sync_snapshots_updated_at
  before update on public.user_sync_snapshots
  for each row
  execute function public.set_updated_at();
