import { MAX_FUNCTION_LENGTH, validateAttempt, type AttemptInput } from "@/lib/attempt-input";

const valid: AttemptInput = {
  puzzleId: 1,
  functionExpr: "x^2 - 2",
  success: true,
  distance: 12.5,
};

describe("validateAttempt", () => {
  test("accepts a successful run with a distance", () => {
    expect(validateAttempt(valid)).toBeNull();
  });

  test("accepts a failed run without a distance", () => {
    expect(validateAttempt({ ...valid, success: false, distance: null })).toBeNull();
  });

  test("accepts a failed run that still has a distance", () => {
    expect(validateAttempt({ ...valid, success: false, distance: 3 })).toBeNull();
  });

  test.each([0, -1, 1.5, NaN])("rejects puzzle id %p", (puzzleId) => {
    expect(validateAttempt({ ...valid, puzzleId })).toBe("Invalid puzzle.");
  });

  test.each(["", "   "])("rejects empty function %p", (functionExpr) => {
    expect(validateAttempt({ ...valid, functionExpr })).toBe("Function can't be empty.");
  });

  test("function length boundary", () => {
    expect(validateAttempt({ ...valid, functionExpr: "x".repeat(MAX_FUNCTION_LENGTH) })).toBeNull();
    expect(validateAttempt({ ...valid, functionExpr: "x".repeat(MAX_FUNCTION_LENGTH + 1) })).toBe(
      "Function is too long.",
    );
  });

  test("trims spaces before checking length", () => {
    const padded = "  " + "x".repeat(MAX_FUNCTION_LENGTH) + "  ";
    expect(validateAttempt({ ...valid, functionExpr: padded })).toBeNull();
  });

  test.each([0, -5, Infinity, NaN])("rejects distance %p", (distance) => {
    expect(validateAttempt({ ...valid, distance })).toBe("Distance must be a positive number.");
  });

  test("accepts a tiny positive distance", () => {
    expect(validateAttempt({ ...valid, distance: 0.0001 })).toBeNull();
  });

  test("rejects a successful run with no distance", () => {
    expect(validateAttempt({ ...valid, distance: null })).toBe("A successful run needs a distance.");
  });

  test("rejects a non boolean success value", () => {
    const bad = { ...valid, success: "yes" } as unknown as AttemptInput;
    expect(validateAttempt(bad)).toBe("Invalid result.");
  });
});
