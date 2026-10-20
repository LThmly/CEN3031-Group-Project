"use client";

import { Application, extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback } from "react";

extend({ Graphics });

// function to draw game grid
export default function GameGraph() {
  const drawGrid = useCallback((graphics: Graphics) => {
    graphics.clear();

    // draw vertical grid lines
    for (let x = 0; x <= 800; x += 40) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, 480);
    }

    // draw horizontal grid lines
    for (let y = 0; y <= 480; y += 40) {
      graphics.moveTo(0, y);
      graphics.lineTo(800, y);
    }

    graphics.stroke({ color: 0x334155, width: 1 });

    // draw coordinate axes
    graphics.moveTo(400, 0);
    graphics.lineTo(400, 480);

    graphics.moveTo(0, 240);
    graphics.lineTo(800, 240);

    graphics.stroke({ color: 0xffffff, width: 2 });
  }, []);

  return (
  <div className="game-graph">
    <Application
      width={800}
      height={480}
      background="#0f172a"
      antialias
    >
      <pixiGraphics draw={drawGrid} />
    </Application>
  </div>
);
}
