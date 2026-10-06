create extension if not exists pgcrypto;

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  message text,
  status text,
  workflow_url text,
  request_payload jsonb,
  response_data jsonb
);

create index if not exists requests_created_at_idx on public.requests (created_at desc);

alter table public.requests enable row level security;

create policy "Allow all reads and writes for demo use" on public.requests
for all
using (true)
with check (true);
