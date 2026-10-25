import { createClient } from "@/lib/supabase/server";

export type LeaderboardRow = {
  rank: number;
  username: string;
  distance: number;
  tries: number;
};

// best run per player for a puzzle, shortest distance first then fewest tries
export async function getLeaderboard(puzzleId: number, limit = 50): Promise<LeaderboardRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_leaderboard", {
    p_puzzle_id: puzzleId,
    p_limit: limit,
  });

  if (error) {
    console.error("[leaderboard] failed to load:", error.message);
    return [];
  }

  return data ?? [];
}
