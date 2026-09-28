create extension if not exists pgcrypto;

create table if not exists public.favoritos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  estado text,
  pais text,
  latitude double precision not null,
  longitude double precision not null,
  criado_em timestamptz not null default now(),
  constraint favoritos_localizacao_unica unique (latitude, longitude)
);

alter table public.favoritos enable row level security;

revoke all on table public.favoritos from anon, authenticated;
grant select, insert, delete on table public.favoritos to anon;

drop policy if exists "Anon pode listar favoritos" on public.favoritos;
create policy "Anon pode listar favoritos"
on public.favoritos
for select
to anon
using (true);

drop policy if exists "Anon pode criar favoritos" on public.favoritos;
create policy "Anon pode criar favoritos"
on public.favoritos
for insert
to anon
with check (true);

drop policy if exists "Anon pode excluir favoritos" on public.favoritos;
create policy "Anon pode excluir favoritos"
on public.favoritos
for delete
to anon
using (true);

