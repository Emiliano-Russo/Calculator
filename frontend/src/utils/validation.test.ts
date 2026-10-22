import { describe, expect, it } from "vitest";
import { parseNumber, sanitizeNumericInput, validateInputs } from "./validation";

describe("sanitizeNumericInput", () => {
  it("strips letters and keeps valid decimals", () => {
    expect(sanitizeNumericInput("12a3.4x")).toBe("123.4");
    expect(sanitizeNumericInput("-5.2")).toBe("-5.2");
    expect(sanitizeNumericInput("abc")).toBe("");
  });
});

describe("parseNumber", () => {
  it("parses valid numbers", () => {
    expect(parseNumber("42")).toBe(42);
    expect(parseNumber("-3.5")).toBe(-3.5);
  });

  it("rejects invalid input", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber("abc")).toBeNull();
  });
});

describe("validateInputs", () => {
  it("flags division by zero client-side", () => {
    expect(validateInputs("divide", "10", "0")).toMatch(/zero/i);
  });

  it("allows sqrt for non-negative a", () => {
    expect(validateInputs("sqrt", "9", "")).toBeNull();
  });

  it("rejects negative sqrt", () => {
    expect(validateInputs("sqrt", "-1", "")).not.toBeNull();
  });
});
