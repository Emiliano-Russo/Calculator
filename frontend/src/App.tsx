import { useState } from "react";
import { calculate } from "./api/calculatorApi";
import type { Operation } from "./types";
import {
  operationNeedsSecondOperand,
  parseNumber,
  sanitizeNumericInput,
  validateInputs,
} from "./utils/validation";

const OPERATIONS: { value: Operation; label: string }[] = [
  { value: "add", label: "Addition (+)" },
  { value: "subtract", label: "Subtraction (−)" },
  { value: "multiply", label: "Multiplication (×)" },
  { value: "divide", label: "Division (÷)" },
  { value: "power", label: "Exponent (^)" },
  { value: "sqrt", label: "Square root (√)" },
  { value: "percent", label: "Percentage (%)" },
];

export default function App() {
  const [operation, setOperation] = useState<Operation>("add");
  const [a, setA] = useState("0");
  const [b, setB] = useState("0");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const needsB = operationNeedsSecondOperand(operation);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const validationError = validateInputs(operation, a, b);
    if (validationError) {
      setError(validationError);
      return;
    }

    const numA = parseNumber(a)!;
    const numB = needsB ? parseNumber(b)! : 0;

    setLoading(true);
    try {
      const response = await calculate({
        operation,
        a: numA,
        b: numB,
      });
      setResult(String(response.result));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate the result.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Calculator</h1>
        <p>Basic and advanced operations via REST API</p>
      </header>

      <main className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Operation</span>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as Operation)}
            >
              {OPERATIONS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{needsB ? "First value (a)" : "Value"}</span>
            <input
              type="text"
              inputMode="decimal"
              value={a}
              onChange={(e) => setA(sanitizeNumericInput(e.target.value))}
              aria-label="First operand"
            />
          </label>

          {needsB && (
            <label className="field">
              <span>
                {operation === "percent"
                  ? "Second value (base)"
                  : "Second value (b)"}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={b}
                onChange={(e) => setB(sanitizeNumericInput(e.target.value))}
                aria-label="Second operand"
              />
            </label>
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Calculating…" : "Calculate"}
          </button>
        </form>

        {error && (
          <div className="message message--error" role="alert">
            {error}
          </div>
        )}

        {result !== null && !error && (
          <div className="message message--result" aria-live="polite">
            <span className="message__label">Result</span>
            <span className="message__value">{result}</span>
          </div>
        )}
      </main>
    </div>
  );
}
