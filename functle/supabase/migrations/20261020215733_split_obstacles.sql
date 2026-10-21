-- split obstacles into one table per shape (#38)
-- column names match the Point type on the graph side (x, y, radius)

create table public.obstacle_circles (
  id bigint generated always as identity primary key,
  puzzle_id bigint not null references public.puzzles (id) on delete cascade,
  x double precision not null,
  y double precision not null,
  radius double precision not null check (radius > 0),
  created_at timestamptz not null default now()
);

-- x, y is the bottom-left corner in graph coords
create table public.obstacle_rects (
  id bigint generated always as identity primary key,
  puzzle_id bigint not null references public.puzzles (id) on delete cascade,
  x double precision not null,
  y double precision not null,
  width double precision not null check (width > 0),
  height double precision not null check (height > 0),
  created_at timestamptz not null default now()
);

-- points like [[0, 0], [1, 2], [2, 0]]
create table public.obstacle_polygons (
  id bigint generated always as identity primary key,
  puzzle_id bigint not null references public.puzzles (id) on delete cascade,
  points jsonb not null check (
    jsonb_typeof(points) = 'array' and jsonb_array_length(points) >= 3
  ),
  created_at timestamptz not null default now()
);

create index obstacle_circles_puzzle_id_idx on public.obstacle_circles (puzzle_id);
create index obstacle_rects_puzzle_id_idx on public.obstacle_rects (puzzle_id);
create index obstacle_polygons_puzzle_id_idx on public.obstacle_polygons (puzzle_id);

-- copy over what's already in obstacles
insert into public.obstacle_circles (puzzle_id, x, y, radius)
select puzzle_id, (data ->> 'cx')::float8, (data ->> 'cy')::float8, (data ->> 'r')::float8
from public.obstacles where shape = 'circle';

insert into public.obstacle_rects (puzzle_id, x, y, width, height)
select puzzle_id, (data ->> 'x')::float8, (data ->> 'y')::float8,
  (data ->> 'width')::float8, (data ->> 'height')::float8
from public.obstacles where shape = 'rect';

insert into public.obstacle_polygons (puzzle_id, points)
select puzzle_id, data -> 'points'
from public.obstacles where shape = 'polygon';

drop table public.obstacles;

-- same rls as the old obstacles table, for each new one
do $$
declare
  t text;
begin
  foreach t in array array['obstacle_circles', 'obstacle_rects', 'obstacle_polygons'] loop
    execute format('alter table public.%I enable row level security', t);

    -- same visibility as the puzzle it belongs to
    execute format(
      'create policy "Obstacles of released puzzles are readable by everyone" on public.%I
         for select to anon, authenticated
         using (exists (select 1 from public.puzzles p where p.id = puzzle_id))', t);

    execute format(
      'create policy "Admins can insert obstacles" on public.%I
         for insert to authenticated
         with check ((select public.is_admin()))', t);

    execute format(
      'create policy "Admins can update obstacles" on public.%I
         for update to authenticated
         using ((select public.is_admin()))
         with check ((select public.is_admin()))', t);

    execute format(
      'create policy "Admins can delete obstacles" on public.%I
         for delete to authenticated
         using ((select public.is_admin()))', t);

    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on table public.%I to authenticated', t);
  end loop;
end;
$$;
