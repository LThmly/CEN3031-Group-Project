// makes sure thaat the graph is only loaded on the client side (in the browser)
"use client";

import dynamic from "next/dynamic";

const GameGraph = dynamic(() => import("./GameGraph"), {
  ssr: false, // sets server side rendering false
});

export default function GameGraphLoader() {
  return <GameGraph />;
}
