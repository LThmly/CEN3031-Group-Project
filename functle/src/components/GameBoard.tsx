"use client";

import { Application, extend } from "@pixi/react";
import { Graphics } from "pixi.js";
import { useCallback } from "react";

extend({ Graphics });

export default function GameBoard() {
  const drawGrid = useCallback((graphics: Graphics) => {
    graphics.clear();

    // Draw vertical grid lines
    for (let x = 0; x <= 800; x += 40) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, 500);
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= 500; y += 40) {
      graphics.moveTo(0, y);
      graphics.lineTo(800, y);
    }

    graphics.stroke({ color: 0x334155, width: 1 });

    // Draw coordinate axes
    graphics.moveTo(400, 0);
    graphics.lineTo(400, 500);

    graphics.moveTo(0, 250);
    graphics.lineTo(800, 250);

    graphics.stroke({ color: 0xffffff, width: 2 });
  }, []);

  return (
  <div className="game-board">
    <Application
      width={800}
      height={500}
      background="#0f172a"
      antialias
    >
      <pixiGraphics draw={drawGrid} />
    </Application>
  </div>
);
}
