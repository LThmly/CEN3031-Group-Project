"use client";

import { Application, extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback } from "react";

//our defined types
import type { Point } from "./Types";

extend({ Graphics });


const WIDTH = 800;
const HEIGHT = 480;
const CENTER_X = WIDTH / 2;   // 400
const CENTER_Y = HEIGHT / 2;  // 240

// recenters cartesian coordinates to map correctly to the plotting coordinates
function toScreen(x: number, y: number) {
  return { sx: CENTER_X + x, sy: CENTER_Y - y };
}

// Draws gridlines
function drawGrid(graphics: Graphics) {
  graphics.clear();

  // grid lines --- vertical
  for (let x = 0; x <= WIDTH; x += 40) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, HEIGHT);
  }// --- horizontal
  for (let y = 0; y <= HEIGHT; y += 40) {
    graphics.moveTo(0, y);
    graphics.lineTo(WIDTH, y);
  }
  graphics.stroke({ color: 0x334155, width: 1 });

  // coordinate axes
  graphics.moveTo(CENTER_X, 0).lineTo(CENTER_X, HEIGHT);
  graphics.moveTo(0, CENTER_Y).lineTo(WIDTH, CENTER_Y);
  graphics.stroke({ color: 0xffffff, width: 2 });
}

// draw a circle for every point passed in
function drawCircles(graphics: Graphics, points: Point[]) {
  graphics.clear();

  for (const { x, y, radius = 8, color = 0xf8385d } of points) {
    const { sx, sy } = toScreen(x, y);

    graphics
      .circle(sx, sy, radius)
      .fill({ color })
      .stroke({ color: 0xffffff, width: 1, alpha: 0.7 });
  }
}



// function to draw game grid
export default function GameGraph({ points = [] }: { points?: Point[] }) {

  const drawGridBounds = useCallback(
    (g: Graphics) => {drawGrid(g);
    }, []);

  const drawPoints = useCallback(
    (graphics: Graphics) => drawCircles(graphics, points),
    [points]
  );

  return (
  <div className="game-graph">
    <Application
      width={WIDTH}
      height={HEIGHT}
      background="#0f172a"
      antialias
    >
      <pixiGraphics draw={drawGrid} />
      <pixiGraphics draw={drawPoints} />
    </Application>
  </div>
);
}
