
"use client";

import dynamic from "next/dynamic";

const GameBoard = dynamic(() => import("./GameBoard"), {
  ssr: false,
});

export default function GameBoardLoader() {
  return <GameBoard />;
}
