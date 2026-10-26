"use client";

import { useRef, useState } from "react";

const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "x", "+", "(", ")", "^", "sqrt("];

export default function FunctionInput() {
  const [expression, setExpression] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function edit(value: string, backspace = false) {
    const input = inputRef.current;
    if (!input) return;

    const end = input.selectionEnd ?? expression.length;
    const selectionStart = input.selectionStart ?? end;
    const start = backspace && selectionStart === end
      ? Math.max(0, selectionStart - 1)
      : selectionStart;

    setExpression(expression.slice(0, start) + value + expression.slice(end));
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + value.length, start + value.length);
    });
  }

  const buttonClass = "rounded border border-zinc-700 bg-zinc-900 p-3 font-mono hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <section aria-label="Function calculator" className="w-full max-w-sm space-y-4 justify-self-center lg:justify-self-end">
      <label htmlFor="function-expression" className="block font-mono">
        f(x) =
      </label>
      <input
        ref={inputRef}
        id="function-expression"
        type="text"
        aria-label="Function"
        placeholder="Enter a function"
        autoComplete="off"
        spellCheck={false}
        value={expression}
        onChange={(event) => setExpression(event.target.value)}
        className="w-full rounded border border-zinc-400 bg-transparent p-3 font-mono"
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={buttonClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setExpression("");
            inputRef.current?.focus();
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className={buttonClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => edit("", true)}
        >
          Backspace
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            className={buttonClass}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => edit(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <button type="button" className={`${buttonClass} w-full`}>
        Enter
      </button>
    </section>
  );
}
