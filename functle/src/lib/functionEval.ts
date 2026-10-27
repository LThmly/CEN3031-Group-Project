// generates the array of points needed for pixi to graph
import { compile } from "mathjs";

import type { GraphPoint } from "@/lib/Types";
import { toScreen } from "@/lib/graphTransform";

export function generateGraphPoints(
  expression: string,
  xMin = -10, // graph goes from -10 to 50 by default
  xMax = 50,
  step = 0.1
): GraphPoint[] {
  if (!expression.trim()) {
    throw new Error("Expression cannot be empty");
  }

  if (step <= 0 || !Number.isFinite(step) || xMin >= xMax) {
    throw new Error("Invalid sampling range");
  }

  const compiled = compile(expression);
  const points: GraphPoint[] = [];

  const sampleCount = Math.ceil((xMax - xMin) / step);

  for (let i = 0; i <= sampleCount; i++) {
    const x = Math.min(xMin + i * step, xMax);

    let y: unknown;

    try {
      y = compiled.evaluate({ x });
    } catch {
      // Skip undefined points
      continue;
    }

    // Graph only finite real-valued results
    if (typeof y !== "number" || !Number.isFinite(y)) {
      continue;
    }

    // Convert mathematical coordinates into screen pixels
    const { sx, sy } = toScreen(x, y);

    if (Number.isFinite(sx) && Number.isFinite(sy)) {
      points.push({ x: sx, y: sy });
    }
  }

  return points;
}
