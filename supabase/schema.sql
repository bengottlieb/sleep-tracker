-- Run this in your Supabase SQL editor to set up the sleep tracker

create table if not exists sleep_entries (
  id              uuid        default gen_random_uuid() primary key,
  date            date        not null unique,
  planned_bedtime time,
  actual_bedtime  time,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Enable RLS with open access (no auth required)
alter table sleep_entries enable row level security;

create policy "Allow all operations" on sleep_entries
  for all using (true) with check (true);
