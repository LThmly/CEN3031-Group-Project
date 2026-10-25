import GameGraphLoader from "@/components/GameGraphLoader";
import type { GraphPoint } from "@/lib/Types";
import { toScreen } from "@/lib/graphTransform";

// demo points in graph coordinates, mapped to the canvas pixels GameGraph draws
const samplePoints: GraphPoint[] = [
  { x: 0, y: 0 },
  { x: 1, y: 4 },
  { x: 2, y: 3 },
].map(({ x, y }) => {
  const { sx, sy } = toScreen(x, y);
  return { x: sx, y: sy };
});

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
