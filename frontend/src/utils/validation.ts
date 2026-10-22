import type { Operation } from "../types";

/** Keeps only characters valid for a decimal number (digits, one `.`, optional leading `-`). */
export function sanitizeNumericInput(value: string): string {
  let out = "";
  let seenDot = false;

  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "-" && out.length === 0) {
      out += ch;
    } else if (ch === "." && !seenDot) {
      seenDot = true;
      out += ch;
    } else if (ch >= "0" && ch <= "9") {
      out += ch;
    }
  }

  return out;
}

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
    return "Enter a valid number for the first operand.";
  }

  if (!operationNeedsSecondOperand(operation)) {
    if (a < 0) {
      return "Square root requires a non-negative number.";
    }
    return null;
  }

  const b = parseNumber(bRaw);
  if (b === null) {
    return "Enter a valid number for the second operand.";
  }

  if (operation === "divide" && b === 0) {
    return "Cannot divide by zero.";
  }

  return null;
}
