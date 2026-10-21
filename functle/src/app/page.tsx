import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center bg-black p-6 text-white">
      <Image
        src="/functle-logo.png"
        alt="Functle"
        width={490}
        height={198}
        priority
        className="h-auto w-full max-w-md"
      />
      <div className="flex w-full flex-1 items-center justify-center">
      <input
        type="text"
        aria-label="Function"
        placeholder="Enter a function"
        autoComplete="off"
        spellCheck={false}
        className="w-full max-w-md rounded border border-zinc-400 bg-transparent p-3 font-mono"
      />
      </div>
    </main>
  );
}
