import Image from "next/image";
import FunctionInput from "@/components/FunctionInput";
import GameGraphLoader from "@/components/GameGraphLoader";
import type { GraphPoint } from "@/lib/Types";
import { toScreen } from "@/lib/graphTransform";
import { getObstaclesForFirstPuzzle } from "@/lib/obstacles";

// puzzle rows are database-backed; never serve a prerendered snapshot
export const dynamic = "force-dynamic";

// demo points in graph coordinates, mapped to the canvas pixels GameGraph draws
const samplePoints: GraphPoint[] = [
  { x: 0, y: 0 },
  { x: 1, y: 4 },
  { x: 2, y: 3 },
].map(({ x, y }) => {
  const { sx, sy } = toScreen(x, y);
  return { x: sx, y: sy };
});

export default async function GameGraph() {
  const obstacles = await getObstaclesForFirstPuzzle();

  return (
    <main className="flex min-h-dvh flex-col bg-black px-6 py-4 text-white lg:h-dvh lg:overflow-hidden">

      {/* Header */}
      <header className="flex justify-center">
        <Image
          src="/functle-logo.png"
          alt="Functle"
          width={490}
          height={198}
          priority
          className="h-auto w-full max-w-md"
        />
      </header>

      <div className="grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-6 self-center py-4 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-label="Game graph" className="flex min-h-0 min-w-0 items-center justify-center lg:h-full">
          <GameGraphLoader points={samplePoints} obstacles={obstacles} />
        </section>
        <FunctionInput />
      </div>

    </main>
  );
}
