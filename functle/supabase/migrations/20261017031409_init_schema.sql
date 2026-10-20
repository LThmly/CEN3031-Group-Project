-- functle initial schema
-- rls on everything, grants set manually per table

-- profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique check (char_length(username) between 3 and 24),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security definer so policies can call this without hitting profiles RLS
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- make a profile on signup, username comes from signUp options.data
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- public so the leaderboard can show usernames
create policy "Profiles are readable by everyone"
  on public.profiles for select
  to anon, authenticated
  using (true);

-- users can only update username (see grant below), not role
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to anon, authenticated;
grant update (username) on table public.profiles to authenticated;

-- puzzles (one per day, admins can add future ones)
create table public.puzzles (
  id bigint generated always as identity primary key,
  puzzle_date date not null unique,
  start_x double precision not null,
  start_y double precision not null,
  end_x double precision not null,
  end_y double precision not null,
  created_by uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.puzzles enable row level security;

-- hide future puzzles from players (current_date is UTC)
create policy "Released puzzles are readable by everyone"
  on public.puzzles for select
  to anon, authenticated
  using (puzzle_date <= current_date or (select public.is_admin()));

create policy "Admins can insert puzzles"
  on public.puzzles for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update puzzles"
  on public.puzzles for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete puzzles"
  on public.puzzles for delete
  to authenticated
  using ((select public.is_admin()));

revoke all on table public.puzzles from anon, authenticated;
grant select on table public.puzzles to anon, authenticated;
grant insert, update, delete on table public.puzzles to authenticated;

-- obstacles
-- data format depends on shape (TODO: confirm with graphing):
--   rect    {"x": 1, "y": 2, "width": 3, "height": 4}
--   circle  {"cx": 0, "cy": 0, "r": 1.5}
--   polygon {"points": [[0, 0], [1, 2], [2, 0]]}
create table public.obstacles (
  id bigint generated always as identity primary key,
  puzzle_id bigint not null references public.puzzles (id) on delete cascade,
  shape text not null check (shape in ('rect', 'circle', 'polygon')),
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index obstacles_puzzle_id_idx on public.obstacles (puzzle_id);

alter table public.obstacles enable row level security;

-- same visibility as the puzzle it belongs to
create policy "Obstacles of released puzzles are readable by everyone"
  on public.obstacles for select
  to anon, authenticated
  using (exists (select 1 from public.puzzles p where p.id = puzzle_id));

create policy "Admins can insert obstacles"
  on public.obstacles for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update obstacles"
  on public.obstacles for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete obstacles"
  on public.obstacles for delete
  to authenticated
  using ((select public.is_admin()));

revoke all on table public.obstacles from anon, authenticated;
grant select on table public.obstacles to anon, authenticated;
grant insert, update, delete on table public.obstacles to authenticated;

-- attempts
-- TODO(#9): success/score come from the client for now
create table public.attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  puzzle_id bigint not null references public.puzzles (id) on delete cascade,
  function_expr text not null,
  success boolean not null default false,
  score integer,
  created_at timestamptz not null default now()
);

create index attempts_user_id_idx on public.attempts (user_id);
create index attempts_puzzle_id_idx on public.attempts (puzzle_id);

alter table public.attempts enable row level security;

create policy "Users can read their own attempts"
  on public.attempts for select
  to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));

create policy "Users can insert their own attempts"
  on public.attempts for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    -- only puzzles that are already out
    and exists (select 1 from public.puzzles p where p.id = puzzle_id)
  );

-- no update/delete on purpose

revoke all on table public.attempts from anon, authenticated;
grant select, insert on table public.attempts to authenticated;
