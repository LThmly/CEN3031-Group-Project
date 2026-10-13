"use client";

import { useState } from "react";
import { parse } from "mathjs";

export default function MathTest() {
  const [expression, setExpression] = useState("x^2 + 2*x - 3");
  const [x, setX] = useState("2");
  const [result, setResult] = useState("");

  function calculate() {
    try {
      const node = parse(expression);
      const compiled = node.compile();
      const y = compiled.evaluate({ x: Number(x) });

      setResult(`Parsed: ${node.toString()}\nResult: ${y}`);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Invalid expression");
    }
  }

  return (
    <main className="flex max-w-xl flex-col gap-4 p-6">
      <label>
        Expression
        <input
          className="block border p-2"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
        />
      </label>
      <label>
        x value
        <input
          className="block border p-2"
          type="number"
          value={x}
          onChange={(event) => setX(event.target.value)}
        />
      </label>
      <button className="self-start border p-2" onClick={calculate}>
        Calculate
      </button>
      <pre>{result}</pre>
    </main>
  );
}
