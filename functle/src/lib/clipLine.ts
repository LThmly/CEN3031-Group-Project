// function to clip line to bounds of the graph
import type { GraphPoint } from "@/lib/Types";

export interface ClipBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function clipLine(
  start: GraphPoint,
  end: GraphPoint,
  bounds: ClipBounds
): [GraphPoint, GraphPoint] | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  let t0 = 0;
  let t1 = 1;

  const p = [-dx, dx, -dy, dy];
  const q = [
    start.x - bounds.left,
    bounds.right - start.x,
    start.y - bounds.top,
    bounds.bottom - start.y,
  ];

  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      // Parallel to a boundary and outside it
      if (q[i] < 0) return null;
      continue;
    }

    const t = q[i] / p[i];

    if (p[i] < 0) {
      t0 = Math.max(t0, t);
    } else {
      t1 = Math.min(t1, t);
    }

    if (t0 > t1) return null;
  }

  return [
    {
      x: start.x + t0 * dx,
      y: start.y + t0 * dy,
    },
    {
      x: start.x + t1 * dx,
      y: start.y + t1 * dy,
    },
  ];
}
