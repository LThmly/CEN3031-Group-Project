# Supabase notes

stuff you need to know to work with the db/auth. run all the commands from inside `functle/`

## getting started

copy `.env.example` to `.env.local` and fill in the 2 values. you can find them in the supabase dashboard under project settings > api keys

```
NEXT_PUBLIC_SUPABASE_URL=https://kbvnndfbjmuemkyvgxrb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

then `npm ci` and `npm run dev`. no docker or local supabase needed, we all use the same project

dont commit `.env.local` and dont use the secret/service_role key anywhere, it skips all the security rules

## tables

- `profiles` - one per user, has `username` and `role` (user or admin). gets created automatically when someone signs up
- `puzzles` - one per day, `puzzle_date` + start and end points
- `obstacle_circles` - `x`, `y`, `radius`
- `obstacle_rects` - `x`, `y` (bottom left corner), `width`, `height`
- `obstacle_polygons` - `points`, a list of `{x, y}` (at least 3)
- `attempts` - every submit, with `function_expr`, `success` and `distance`

everything is in graph coordinates. the puzzle changes at midnight UTC

who can do what:
- anyone can read profiles, puzzles and obstacles (but not future puzzles)
- only admins can add/edit puzzles and obstacles
- you can only see and save your own attempts
- you can change your username but not your role

## using it in code

```ts
// server side (server components, server actions, route handlers)
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// client components
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

helpers that are already there:
- `saveAttempt()` in `src/lib/attempts.ts` - saves a submit for whoever is logged in. if `success` is true you have to pass the `distance`
- `getLeaderboard(puzzleId)` in `src/lib/leaderboard.ts` - gives you `rank, username, distance, tries`, shortest distance first and fewer tries breaks ties
- `requireAdmin()` in `src/lib/auth.ts` - put it at the top of admin pages, non admins get a 404

to check who's logged in on the server use `supabase.auth.getClaims()`

auth pages are `/login`, `/signup`, `/forgot-password`, `/reset-password` and `/account`. `/admin` and `/account` send you to login if you're not signed in

## changing the db

please dont change tables from the dashboard, do it with a migration so it's in git

first time only:
```
npx supabase login
npx supabase link --project-ref kbvnndfbjmuemkyvgxrb
```
it'll ask for the db password, ask me for it

then:
1. `npx supabase migration new some_name` - makes a new file in `supabase/migrations/`
2. write your sql there. if you make a new table turn on rls and add policies or nobody will be able to read it
3. `npx supabase db push --linked --dry-run` to see what it's gonna run
4. `npx supabase db push --linked` to actually run it
5. update the types (below) and commit everything together

we all share the same db so let me know before you push a migration

if you get `Remote migration versions not found in local migrations directory` it means someone pushed a migration you don't have yet. pull main into your branch and try again. if it's from a PR that isn't merged yet wait for it or branch off that one

dont use `supabase migration repair` to fix that error, it breaks the history for everyone

## types

`src/types/database.ts` gets generated from the db, dont edit it by hand. after changing the db run

```
npm run db:types
```

## making someone admin

in the dashboard go to sql editor and run

```sql
update public.profiles set role = 'admin' where username = 'their_username';
```

change it back to `'user'` to remove it
