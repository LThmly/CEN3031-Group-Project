-- sample puzzles for testing: one for today, one for tomorrow (should be hidden)
-- dates are relative so this still works whenever it's run

with p as (
  insert into public.puzzles (puzzle_date, start_x, start_y, end_x, end_y)
  values (current_date, -5, 0, 5, 0)
  on conflict (puzzle_date) do nothing
  returning id
), c as (
  insert into public.obstacle_circles (puzzle_id, x, y, radius)
  select id, 3, 3, 1 from p
)
insert into public.obstacle_rects (puzzle_id, x, y, width, height)
select id, -1, -1, 2, 2 from p;

with p as (
  insert into public.puzzles (puzzle_date, start_x, start_y, end_x, end_y)
  values (current_date + 1, -4, -2, 4, 2)
  on conflict (puzzle_date) do nothing
  returning id
), c as (
  insert into public.obstacle_circles (puzzle_id, x, y, radius)
  select id, 0, 0, 1.5 from p
)
insert into public.obstacle_polygons (puzzle_id, points)
select id, '[[2, -3], [3, -1], [1, -1]]'::jsonb from p;
