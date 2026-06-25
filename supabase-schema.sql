-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

create extension if not exists "uuid-ossp";

create table public.reviews (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  created_at    timestamptz default now(),
  language      text not null check (language in ('javascript','typescript','react','nextjs')),
  original_code text not null,
  score         integer not null check (score between 0 and 100),
  summary       text not null,
  bugs          jsonb default '[]',
  performance   jsonb default '[]',
  security      jsonb default '[]',
  clean_code    jsonb default '[]',
  refactored_code text,
  explanation   text not null
);

alter table public.reviews enable row level security;

create policy "Users see own reviews" on public.reviews
  for select using (auth.uid() = user_id);

create policy "Users insert own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "Users delete own reviews" on public.reviews
  for delete using (auth.uid() = user_id);

create index reviews_user_created on public.reviews(user_id, created_at desc);
