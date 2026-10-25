import test from "node:test";
import assert from "node:assert/strict";

import {
  circleRowToObstacle,
  rectRowToObstacle,
} from "./obstacleRows.ts";
import { SCALE_X, SCALE_Y } from "./graphConstants.ts";
import { toScreen } from "./graphTransform.ts";

const origin = toScreen(0, 0);

test("maps a circle row using its center", () => {
  assert.deepEqual(circleRowToObstacle({ x: 0, y: 0, radius: 1 }), {
    shape: "circle",
    x: origin.sx,
    y: origin.sy,
    radius: SCALE_X,
  });
});

test("maps a circle at a non-origin point", () => {
  const center = toScreen(3, 3);
  assert.deepEqual(circleRowToObstacle({ x: 3, y: 3, radius: 2 }), {
    shape: "circle",
    x: center.sx,
    y: center.sy,
    radius: 2 * SCALE_X,
  });
});

test("rejects invalid circle rows", () => {
  assert.equal(circleRowToObstacle({ x: 0, y: 0, radius: 0 }), null);
  assert.equal(circleRowToObstacle({ x: 0, y: 0, radius: -1 }), null);
  assert.equal(circleRowToObstacle({ x: 0, y: 0, radius: NaN }), null);
  assert.equal(circleRowToObstacle({ x: "0", y: 0, radius: 1 }), null);
  assert.equal(circleRowToObstacle({ x: null, y: 0, radius: 1 }), null);
});

test("maps a rect row from its bottom-left corner to a centered rectangle", () => {
  assert.deepEqual(
    rectRowToObstacle({ x: -1, y: -1, width: 2, height: 2 }),
    {
      shape: "rectangle",
      x: origin.sx,
      y: origin.sy,
      width: 2 * SCALE_X,
      height: 2 * SCALE_Y,
    }
  );
});

test("maps a rect offset from the origin", () => {
  const center = toScreen(2.5, 1);
  assert.deepEqual(
    rectRowToObstacle({ x: 2, y: 0, width: 1, height: 2 }),
    {
      shape: "rectangle",
      x: center.sx,
      y: center.sy,
      width: SCALE_X,
      height: 2 * SCALE_Y,
    }
  );
});

test("rejects invalid rect rows", () => {
  assert.equal(
    rectRowToObstacle({ x: 0, y: 0, width: 0, height: 2 }),
    null
  );
  assert.equal(
    rectRowToObstacle({ x: 0, y: 0, width: 2, height: -1 }),
    null
  );
  assert.equal(
    rectRowToObstacle({ x: 0, y: 0, width: Infinity, height: 2 }),
    null
  );
  assert.equal(
    rectRowToObstacle({ x: undefined, y: 0, width: 1, height: 1 }),
    null
  );
});
