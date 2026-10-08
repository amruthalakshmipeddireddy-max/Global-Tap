-- Run this once in your Supabase project: Dashboard -> SQL Editor -> New query.
-- It creates the profiles table that stores each user's information.
-- The backend inserts a row here right after sign-up.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  home_country text not null default 'IN',
  home_currency text not null default 'INR',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);
