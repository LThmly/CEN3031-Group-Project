-- sample puzzles for testing: one for today, one for tomorrow (should be hidden)
-- dates are relative so this still works whenever it's run

with p as (
  insert into public.puzzles (puzzle_date, start_x, start_y, end_x, end_y)
  values (current_date, -5, 0, 5, 0)
  on conflict (puzzle_date) do nothing
  returning id
)
insert into public.obstacles (puzzle_id, shape, data)
select id, shape, data::jsonb
from p, (values
  ('rect', '{"x": -1, "y": -1, "width": 2, "height": 2}'),
  ('circle', '{"cx": 3, "cy": 3, "r": 1}')
) as o (shape, data);

with p as (
  insert into public.puzzles (puzzle_date, start_x, start_y, end_x, end_y)
  values (current_date + 1, -4, -2, 4, 2)
  on conflict (puzzle_date) do nothing
  returning id
)
insert into public.obstacles (puzzle_id, shape, data)
select id, shape, data::jsonb
from p, (values
  ('circle', '{"cx": 0, "cy": 0, "r": 1.5}'),
  ('polygon', '{"points": [[2, -3], [3, -1], [1, -1]]}')
) as o (shape, data);
