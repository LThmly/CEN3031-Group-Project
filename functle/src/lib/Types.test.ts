import test from "node:test";
import assert from "node:assert/strict";

import { valuesToPoints } from "./Types.ts";
import { SCALE_X, SCALE_Y } from "./graphConstants.ts";
import { toScreen } from "./graphTransform.ts";

// Builds the expected canvas point the same way the graph places a data point.
function pointAt(x: number, y: number) {
  const { sx, sy } = toScreen(x, y);
  return { x: sx, y: sy };
}

const ORIGIN = pointAt(0, 0);

test("first sample sits on the vertical axis at x = 0", () => {
  const points = valuesToPoints([3, 7], 2);
  assert.deepEqual(points[0], pointAt(0, 3));
  assert.equal(points[0].x, ORIGIN.x);
});

test("a value of 0 maps onto the horizontal axis", () => {
  const points = valuesToPoints([10, 0, -10], 5);
  assert.equal(points[1].y, ORIGIN.y);
});

test("first value 0 maps exactly to the off-center graph origin", () => {
  assert.deepEqual(valuesToPoints([0], 5), [ORIGIN]);
  // 720px plot / 60 graph units, offset by 40px padding
  assert.ok(Math.abs(ORIGIN.x - 160) < 1e-9);
  assert.ok(Math.abs(ORIGIN.y - 240) < 1e-9);
});

test("spaces samples by xDelta in canvas pixels", () => {
  const points = valuesToPoints([1, 2, 3], 0.5);
  assert.ok(Math.abs(points[1].x - points[0].x - 0.5 * SCALE_X) < 1e-9);
  assert.ok(Math.abs(points[2].x - points[1].x - 0.5 * SCALE_X) < 1e-9);
});

test("y values map directly and grow upward", () => {
  const [a, b] = valuesToPoints([0, 10], 1);
  assert.equal(a.y, ORIGIN.y);
  assert.ok(Math.abs(a.y - b.y - 10 * SCALE_Y) < 1e-9);
  assert.equal(b.x, pointAt(1, 0).x);
});

test("multiplication keeps x exact instead of accumulating float drift", () => {
  const points = valuesToPoints(Array.from({ length: 11 }, () => 0), 0.1);
  assert.ok(Math.abs(points[10].x - ORIGIN.x - SCALE_X) < 1e-9);
});

test("supports a negative xDelta", () => {
  const points = valuesToPoints([1, 2, 3], -0.5);
  assert.equal(points[0].x, ORIGIN.x);
  assert.ok(points[1].x < points[0].x);
  assert.ok(Math.abs(points[1].x - (ORIGIN.x - 0.5 * SCALE_X)) < 1e-9);
});

test("supports a zero xDelta", () => {
  const points = valuesToPoints([1, 2], 0);
  assert.equal(points[0].x, ORIGIN.x);
  assert.equal(points[1].x, ORIGIN.x);
});

test("nonzero first value stays on the axis without a vertical shift", () => {
  const [first] = valuesToPoints([5], 1);
  assert.equal(first.x, ORIGIN.x);
  assert.notEqual(first.y, ORIGIN.y);
  assert.equal(first.y, pointAt(0, 5).y);
});

test("returns no points for an empty array", () => {
  assert.deepEqual(valuesToPoints([], 0.5), []);
});

test("returns one new point per value", () => {
  const values = [1, 2, 3];
  const points = valuesToPoints(values, 1);
  assert.equal(points.length, values.length);
  assert.notEqual(points, values);
  assert.deepEqual(points, [pointAt(0, 1), pointAt(1, 2), pointAt(2, 3)]);
});
