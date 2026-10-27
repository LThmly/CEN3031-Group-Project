import Image from "next/image";
import Game from "@/components/Game";
import { getObstaclesForFirstPuzzle } from "@/lib/obstacles";

// puzzle rows are database-backed; never serve a prerendered snapshot
export const dynamic = "force-dynamic";

// demo points in graph coordinates, mapped to the canvas pixels GameGraph draws
// const samplePoints: GraphPoint[] = [
//   { x: 0, y: 0 },
//   { x: 1, y: 4 },
//   { x: 2, y: 3 },
// ].map(({ x, y }) => {
//   const { sx, sy } = toScreen(x, y);
//   return { x: sx, y: sy };
// });

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
      {/* this is the entire game interface, including the graph and the function input */}
      <Game obstacles={obstacles} />

    </main>
  );
}
