export type AttemptInput = {
  puzzleId: number;
  functionExpr: string;
  success: boolean;
  // path length in graph units, null if the run failed
  distance: number | null;
};

export const MAX_FUNCTION_LENGTH = 500;

// checks what the game sends before saving, returns an error message or null if it's fine
export function validateAttempt(input: AttemptInput): string | null {
  if (!Number.isInteger(input.puzzleId) || input.puzzleId <= 0) {
    return "Invalid puzzle.";
  }

  const expr = typeof input.functionExpr === "string" ? input.functionExpr.trim() : "";
  if (!expr) return "Function can't be empty.";
  if (expr.length > MAX_FUNCTION_LENGTH) return "Function is too long.";

  if (typeof input.success !== "boolean") return "Invalid result.";

  if (input.distance !== null) {
    if (typeof input.distance !== "number" || !Number.isFinite(input.distance) || input.distance <= 0) {
      return "Distance must be a positive number.";
    }
  }
  if (input.success && input.distance === null) {
    return "A successful run needs a distance.";
  }

  return null;
}
