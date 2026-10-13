
import GameBoardLoader from "@/components/GameBoardLoader";

export default function GamePage() {
  return (
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
          <GameBoardLoader />
        </div>
      </section>

      {/* Future controls */}
      <section className="min-h-0 w-full">
        {/* Game controls will go here */}
      </section>

    </main>
  );
}
