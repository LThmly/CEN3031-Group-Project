"use server";

import { validateAttempt, type AttemptInput } from "@/lib/attempt-input";
import { createClient } from "@/lib/supabase/server";

// call this from the game every time the player hits submit
export async function saveAttempt(input: AttemptInput): Promise<{ error?: string }> {
  const invalid = validateAttempt(input);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { error: "Log in to save your attempts." };

  // user_id defaults to the logged in user
  const { error } = await supabase.from("attempts").insert({
    puzzle_id: input.puzzleId,
    function_expr: input.functionExpr.trim(),
    success: input.success,
    distance: input.distance,
  });

  if (error) {
    console.error("[attempts] insert failed:", error.message);
    return { error: "Couldn't save your attempt." };
  }

  return {};
}
