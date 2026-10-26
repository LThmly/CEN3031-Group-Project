-- #9: score is the path distance now (shorter is better), ties go to fewer tries

alter table public.attempts drop column score;

-- TODO: distance comes from the client for now, validate it on the server later
alter table public.attempts
  add column distance double precision check (distance > 0),
  add constraint attempts_success_needs_distance check (not success or distance is not null);

-- best successful run per player for a puzzle
-- tries = how many submits it took to get that run (counting it)
-- security definer because players can't read each other's attempts directly,
-- this only exposes username / distance / tries, not the functions
create function public.get_leaderboard(p_puzzle_id bigint, p_limit int default 50)
returns table (rank bigint, username text, distance double precision, tries bigint)
language sql
stable
security definer
set search_path = ''
as $$
  with numbered as (
    select
      a.user_id,
      a.success,
      a.distance,
      row_number() over (partition by a.user_id order by a.created_at, a.id) as try_no
    from public.attempts a
    where a.puzzle_id = p_puzzle_id
      -- same rule as the puzzles table, no leaderboard for unreleased puzzles
      and exists (
        select 1 from public.puzzles p
        where p.id = p_puzzle_id
          and (p.puzzle_date <= current_date or public.is_admin())
      )
  ),
  best as (
    select distinct on (user_id) user_id, distance, try_no
    from numbered
    where success
    order by user_id, distance, try_no
  )
  select
    rank() over (order by b.distance, b.try_no),
    pr.username,
    b.distance,
    b.try_no
  from best b
  join public.profiles pr on pr.id = b.user_id
  order by 1, pr.username
  limit p_limit;
$$;

revoke execute on function public.get_leaderboard(bigint, int) from public;
grant execute on function public.get_leaderboard(bigint, int) to anon, authenticated;
