import { useState } from "react";
import { calculate } from "./api/calculatorApi";
import type { Operation } from "./types";
import {
  operationNeedsSecondOperand,
  parseNumber,
  validateInputs,
} from "./utils/validation";

const OPERATIONS: { value: Operation; label: string }[] = [
  { value: "add", label: "Suma (+)" },
  { value: "subtract", label: "Resta (−)" },
  { value: "multiply", label: "Multiplicación (×)" },
  { value: "divide", label: "División (÷)" },
  { value: "power", label: "Potencia (^)" },
  { value: "sqrt", label: "Raíz cuadrada (√)" },
  { value: "percent", label: "Porcentaje (%)" },
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
        err instanceof Error ? err.message : "Error al calcular el resultado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Calculadora</h1>
        <p>Operaciones básicas y avanzadas vía API REST</p>
      </header>

      <main className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Operación</span>
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
            <span>{needsB ? "Primer valor (a)" : "Valor"}</span>
            <input
              type="text"
              inputMode="decimal"
              value={a}
              onChange={(e) => setA(e.target.value)}
              aria-label="Primer operand"
            />
          </label>

          {needsB && (
            <label className="field">
              <span>
                {operation === "percent"
                  ? "Segundo valor (base)"
                  : "Segundo valor (b)"}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={b}
                onChange={(e) => setB(e.target.value)}
                aria-label="Segundo operand"
              />
            </label>
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Calculando…" : "Calcular"}
          </button>
        </form>

        {error && (
          <div className="message message--error" role="alert">
            {error}
          </div>
        )}

        {result !== null && !error && (
          <div className="message message--result" aria-live="polite">
            <span className="message__label">Resultado</span>
            <span className="message__value">{result}</span>
          </div>
        )}
      </main>
    </div>
  );
}
