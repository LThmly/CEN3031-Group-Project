import { clipLine } from "@/lib/clipLine";
import type { GraphPoint } from "@/lib/Types";

import { generateGraphPoints } from "@/lib/functionEval";
import {
PLOT_LEFT,
PLOT_RIGHT,
PLOT_TOP,
PLOT_BOTTOM,
} from "@/lib/graphConstants";


describe("Line Clipping", () => {
const bounds = {
    left: 0,
    right: 100,
    top: 0,
    bottom: 100,
};

function checkPoint(
    actual: GraphPoint,
    expected: GraphPoint
) {
    expect(actual.x).toBeCloseTo(expected.x);
    expect(actual.y).toBeCloseTo(expected.y);
}

test("keeps a line entirely inside the plot", () => {
    const result = clipLine(
    { x: 10, y: 20 },
    { x: 80, y: 90 },
    bounds
    );

    expect(result).not.toBeNull();

    checkPoint(result![0], { x: 10, y: 20 });
    checkPoint(result![1], { x: 80, y: 90 });
});

test("rejects a line entirely outside the plot", () => {
    const result = clipLine(
    { x: -50, y: -20 },
    { x: -10, y: -5 },
    bounds
    );

    expect(result).toBeNull();
});

test("clips a line crossing the top boundary", () => {
    const result = clipLine(
    { x: 50, y: 50 },
    { x: 50, y: -50 },
    bounds
    );

    expect(result).not.toBeNull();

    checkPoint(result![0], { x: 50, y: 50 });
    checkPoint(result![1], { x: 50, y: 0 });
});

test("clips a line crossing the bottom boundary", () => {
    const result = clipLine(
    { x: 50, y: 50 },
    { x: 50, y: 150 },
    bounds
    );

    expect(result).not.toBeNull();

    checkPoint(result![0], { x: 50, y: 50 });
    checkPoint(result![1], { x: 50, y: 100 });
});

test("clips a line crossing the left boundary", () => {
    const result = clipLine(
    { x: -50, y: 50 },
    { x: 50, y: 50 },
    bounds
    );

    expect(result).not.toBeNull();

    checkPoint(result![0], { x: 0, y: 50 });
    checkPoint(result![1], { x: 50, y: 50 });
});

test("clips a line crossing the right boundary", () => {
    const result = clipLine(
    { x: 50, y: 50 },
    { x: 150, y: 50 },
    bounds
    );

    expect(result).not.toBeNull();

    checkPoint(result![0], { x: 50, y: 50 });
    checkPoint(result![1], { x: 100, y: 50 });
});

test("clips both endpoints of a diagonal line", () => {
    const result = clipLine(
    { x: -50, y: 150 },
    { x: 150, y: -50 },
    bounds
    );

    expect(result).not.toBeNull();

    checkPoint(result![0], { x: 0, y: 100 });
    checkPoint(result![1], { x: 100, y: 0 });
});

test("keeps all clipped coordinates inside bounds", () => {
    const testSegments = [
    [{ x: -100, y: 50 }, { x: 200, y: 50 }],
    [{ x: 50, y: -100 }, { x: 50, y: 200 }],
    [{ x: -50, y: 150 }, { x: 150, y: -50 }],
    [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    ];

    for (const [start, end] of testSegments) {
    const result = clipLine(start, end, bounds);

    expect(result).not.toBeNull();

    for (const point of result!) {
        expect(point.x).toBeGreaterThanOrEqual(bounds.left);
        expect(point.x).toBeLessThanOrEqual(bounds.right);
        expect(point.y).toBeGreaterThanOrEqual(bounds.top);
        expect(point.y).toBeLessThanOrEqual(bounds.bottom);
    }
    }
});

test("clips f(x) = 3x to the actual graph boundaries", () => {
    const points = generateGraphPoints("3x");

    const plotBounds = {
        left: PLOT_LEFT,
        right: PLOT_RIGHT,
        top: PLOT_TOP,
        bottom: PLOT_BOTTOM,
    };

    let visibleSegments = 0;

    for (let i = 1; i < points.length; i++) {
        const segment = clipLine(
        points[i - 1],
        points[i],
        plotBounds
        );

        if (!segment) continue;

        visibleSegments++;

        for (const point of segment) {
        expect(point.x).toBeGreaterThanOrEqual(PLOT_LEFT);
        expect(point.x).toBeLessThanOrEqual(PLOT_RIGHT);
        expect(point.y).toBeGreaterThanOrEqual(PLOT_TOP);
        expect(point.y).toBeLessThanOrEqual(PLOT_BOTTOM);
        }
    }

    expect(visibleSegments).toBeGreaterThan(0);
});


});
