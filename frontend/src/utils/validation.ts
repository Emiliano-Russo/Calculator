import type { Operation } from "../types";

export function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}

export function operationNeedsSecondOperand(op: Operation): boolean {
  return op !== "sqrt";
}

export function validateInputs(
  operation: Operation,
  aRaw: string,
  bRaw: string,
): string | null {
  const a = parseNumber(aRaw);
  if (a === null) {
    return "Ingresá un valor numérico válido para el primer operand.";
  }

  if (!operationNeedsSecondOperand(operation)) {
    if (a < 0) {
      return "La raíz cuadrada requiere un número no negativo.";
    }
    return null;
  }

  const b = parseNumber(bRaw);
  if (b === null) {
    return "Ingresá un valor numérico válido para el segundo operand.";
  }

  if (operation === "divide" && b === 0) {
    return "No se puede dividir por cero.";
  }

  return null;
}
