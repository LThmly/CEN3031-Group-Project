import GameGraphLoader from "@/components/GameGraphLoader";
import type { Point } from "./Types";

const samplePoints: Point[] = [
  { x: 0, y: 0 },
  { x: 80, y: 40,},
  { x: -120, y: -80, radius: 12 },
];

export default function GameGraph() {
  return (
    /* 
    sets up the layout of the page so that it fills the screen and can't scroll and then splits the screen into 3 grid rows for each component
    */ 
    <main className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_25%] overflow-hidden bg-slate-950 px-6 py-4 text-white">

      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold">
          Functle
        </h1>
      </header>

      {/* Graph */}
      <section className="flex min-h-0 min-w-0 items-center justify-center py-4">
        <div className="h-full w-full min-h-0">
          <GameGraphLoader points={samplePoints} />
        </div>
      </section>

      {/* Blank space for input ui */}
      {/* Future controls */}
      <section className="min-h-0 w-full">
        {/* Game controls will go here */}
      </section>

    </main>
  );
}
