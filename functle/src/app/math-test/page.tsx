"use client";

import { useState } from "react";
import { evaluate, format } from "mathjs";

const tests = [
  { expression: "2 + 3 * 4", x: 2 },
  { expression: "(2 + 3) * 4", x: 2 },
  { expression: "2^3^2", x: 2 },
  { expression: "-2^2", x: 2 },
  { expression: "(-2)^2", x: 2 },
  { expression: "2^-3", x: 2 },
  { expression: "10 % 3", x: 2 },
  { expression: "5!", x: 2 },
  { expression: "0.1 + 0.2", x: 2 },
  { expression: "x^2 + 2*x - 3", x: 2 },
  { expression: "2x + 1", x: 3 },
  { expression: "2(x + 1)", x: 3 },
  { expression: "(x + 1)(x - 1)", x: 3 },
  { expression: "x < 0 ? -x : x", x: -3 },
  { expression: "5", x: 2 },
  { expression: "pi", x: 2 },
  { expression: "e", x: 2 },
  { expression: "2pi", x: 2 },
  { expression: "e^2", x: 2 },
  { expression: "sin(pi / 2)", x: 2 },
  { expression: "cos(pi)", x: 2 },
  { expression: "tan(pi / 4)", x: 2 },
  { expression: "sin(x)", x: Math.PI / 6 },
  { expression: "sin(30 deg)", x: 2 },
  { expression: "asin(1)", x: 2 },
  { expression: "acos(-1)", x: 2 },
  { expression: "atan(1)", x: 2 },
  { expression: "atan2(1, 1)", x: 2 },
  { expression: "sec(0)", x: 2 },
  { expression: "csc(pi / 2)", x: 2 },
  { expression: "cot(pi / 4)", x: 2 },
  { expression: "sin(x)^2 + cos(x)^2", x: 1.23 },
  { expression: "sinh(0)", x: 2 },
  { expression: "cosh(0)", x: 2 },
  { expression: "tanh(0)", x: 2 },
  { expression: "log(e)", x: 2 },
  { expression: "log(8, 2)", x: 2 },
  { expression: "log10(1000)", x: 2 },
  { expression: "log2(32)", x: 2 },
  { expression: "exp(2)", x: 2 },
  { expression: "log(exp(x))", x: 2 },
  { expression: "sqrt(81)", x: 2 },
  { expression: "cbrt(-8)", x: 2 },
  { expression: "nthRoot(32, 5)", x: 2 },
  { expression: "abs(-7)", x: 2 },
  { expression: "floor(-2.3)", x: 2 },
  { expression: "ceil(-2.3)", x: 2 },
  { expression: "round(2.345, 2)", x: 2 },
  { expression: "sign(-7)", x: 2 },
  { expression: "sqrt(-4)", x: 2 },
  { expression: "i^2", x: 2 },
  { expression: "[1, 2, 3] * 2", x: 2 },
  { expression: "x > 0", x: 2 },
  { expression: "5 cm to mm", x: 2 },
  { expression: "1 / x", x: 0 },
  { expression: "0 / 0", x: 2 },
  { expression: "log(0)", x: 2 },
  { expression: "exp(1000)", x: 2 },
  { expression: "y = x^2", x: 3 },
  { expression: "x +", x: 2 },
  { expression: "(x + 1", x: 2 },
  { expression: "x + z", x: 2 },
  { expression: "ln(e)", x: 2 },
  { expression: "Sin(x)", x: 2 },
];

export default function MathTest() {
  const [results, setResults] = useState<string[]>([]);

  function runTests() {
    const outputs = tests.map((test) => {
      try {
        const value = evaluate(test.expression, { x: test.x });
        return format(value);
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    });
    setResults(outputs);
  }

  return (
    <main className="p-6">
      <button className="mb-4 border p-2" onClick={runTests}>
        Run tests
      </button>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Expression</th>
            <th>x</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test, index) => (
            <tr key={test.expression}>
              <td>{test.expression}</td>
              <td>{test.x}</td>
              <td>{results[index] ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
