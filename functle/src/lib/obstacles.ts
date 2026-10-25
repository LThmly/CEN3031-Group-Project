import { createClient } from "@/lib/supabase/server";
import {
  circleRowToObstacle,
  rectRowToObstacle,
} from "@/lib/obstacleRows";
import type { Obstacle } from "@/lib/Types";

/**
 * Loads the obstacles for the first puzzle (lowest id). Returns canvas-pixel
 * obstacles ready for GameGraph.
 *
 * Row-level security limits reads to released puzzles and their obstacles.
 */
export async function getObstaclesForFirstPuzzle(): Promise<Obstacle[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    console.warn(
      "[obstacles] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set; drawing no obstacles."
    );
    return [];
  }

  const supabase = await createClient();

  const { data: puzzle, error: puzzleError } = await supabase
    .from("puzzles")
    .select("id")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (puzzleError) {
    console.error("[obstacles] failed to load the first puzzle:", puzzleError.message);
    return [];
  }
  if (!puzzle) return [];

  const [circles, rects] = await Promise.all([
    supabase
      .from("obstacle_circles")
      .select("x, y, radius")
      .eq("puzzle_id", puzzle.id),
    supabase
      .from("obstacle_rects")
      .select("x, y, width, height")
      .eq("puzzle_id", puzzle.id),
  ]);

  if (circles.error) {
    console.error(
      "[obstacles] failed to load circle obstacles:",
      circles.error.message
    );
  }
  if (rects.error) {
    console.error(
      "[obstacles] failed to load rectangle obstacles:",
      rects.error.message
    );
  }

  return [
    ...(circles.data ?? []).map(circleRowToObstacle),
    ...(rects.data ?? []).map(rectRowToObstacle),
  ].filter((obstacle): obstacle is Obstacle => obstacle !== null);
}
