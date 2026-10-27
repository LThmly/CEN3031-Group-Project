import { generateGraphPoints } from "@/lib/functionEval";
import { toScreen } from "@/lib/graphTransform";

describe("generateGraphPoints", () => {
  test("generates points for a quadratic function", () => {
    const points = generateGraphPoints("x^2", -2, 2, 1);

    expect(points).toHaveLength(5);

    const expected = [
      [-2, 4],
      [-1, 1],
      [0, 0],
      [1, 1],
      [2, 4],
    ];

    expected.forEach(([x, y], index) => {
      const screen = toScreen(x, y);

      expect(points[index].x).toBeCloseTo(screen.sx);
      expect(points[index].y).toBeCloseTo(screen.sy);
    });
  });

  test("generates points for a linear function", () => {
    const points = generateGraphPoints("2*x + 1", 0, 2, 1);

    expect(points).toHaveLength(3);

    const expected = toScreen(2, 5);

    expect(points[2].x).toBeCloseTo(expected.sx);
    expect(points[2].y).toBeCloseTo(expected.sy);
  });

  test("evaluates trigonometric functions", () => {
    const points = generateGraphPoints(
      "sin(x)",
      0,
      Math.PI,
      Math.PI / 2
    );

    expect(points).toHaveLength(3);

    const expected = toScreen(Math.PI / 2, 1);

    expect(points[1].x).toBeCloseTo(expected.sx);
    expect(points[1].y).toBeCloseTo(expected.sy);
  });

  test("supports constant functions", () => {
    const points = generateGraphPoints("5", 0, 2, 1);

    expect(points).toHaveLength(3);

    points.forEach((point, index) => {
      const expected = toScreen(index, 5);

      expect(point.x).toBeCloseTo(expected.sx);
      expect(point.y).toBeCloseTo(expected.sy);
    });
  });

  test("skips undefined or complex results", () => {
    const points = generateGraphPoints("sqrt(x)", -2, 2, 1);

    // Negative x values produce complex results
    expect(points).toHaveLength(3);

    const expected = [
      [0, 0],
      [1, 1],
      [2, Math.sqrt(2)],
    ];

    expected.forEach(([x, y], index) => {
      const screen = toScreen(x, y);

      expect(points[index].x).toBeCloseTo(screen.sx);
      expect(points[index].y).toBeCloseTo(screen.sy);
    });
  });

  test("skips non-finite results", () => {
    const points = generateGraphPoints("1/x", -1, 1, 1);

    // x = 0 produces Infinity
    expect(points).toHaveLength(2);

    const left = toScreen(-1, -1);
    const right = toScreen(1, 1);

    expect(points[0].x).toBeCloseTo(left.sx);
    expect(points[1].x).toBeCloseTo(right.sx);
  });

  test("rejects invalid mathematical syntax", () => {
    expect(() => generateGraphPoints("x +")).toThrow();
  });

  test("rejects empty expressions", () => {
    expect(() => generateGraphPoints("")).toThrow(
      "Expression cannot be empty"
    );
  });

  test("rejects whitespace-only expressions", () => {
    expect(() => generateGraphPoints("   ")).toThrow(
      "Expression cannot be empty"
    );
  });

  test("rejects invalid sampling intervals", () => {
    expect(() =>
      generateGraphPoints("x^2", -10, 10, 0)
    ).toThrow("Invalid sampling range");

    expect(() =>
      generateGraphPoints("x^2", -10, 10, -1)
    ).toThrow("Invalid sampling range");
  });

  test("rejects reversed sampling bounds", () => {
    expect(() =>
      generateGraphPoints("x^2", 10, -10, 1)
    ).toThrow("Invalid sampling range");
  });

  test("uses the default graph range", () => {
    const points = generateGraphPoints("x");

    // [-10, 50] inclusive, sampled every 0.1
    expect(points).toHaveLength(601);
  });
});
