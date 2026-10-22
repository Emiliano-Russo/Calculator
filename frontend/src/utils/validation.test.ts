import { describe, expect, it } from "vitest";
import { parseNumber, validateInputs } from "./validation";

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
    expect(validateInputs("divide", "10", "0")).toMatch(/cero/i);
  });

  it("allows sqrt for non-negative a", () => {
    expect(validateInputs("sqrt", "9", "")).toBeNull();
  });

  it("rejects negative sqrt", () => {
    expect(validateInputs("sqrt", "-1", "")).not.toBeNull();
  });
});
