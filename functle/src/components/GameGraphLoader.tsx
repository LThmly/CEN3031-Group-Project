// makes sure thaat the graph is only loaded on the client side (in the browser)
"use client";

import dynamic from "next/dynamic";
import type { GraphPoint, Obstacle } from "@/lib/Types";


const GameGraph = dynamic(() => import("./GameGraph"), {
  ssr: false, // sets server side rendering false
});

export default function GameGraphLoader({
  points,
  obstacles,
}: {
  points?: GraphPoint[];
  obstacles?: Obstacle[];
}) {
  return <GameGraph points={points} obstacles={obstacles} />;
}
