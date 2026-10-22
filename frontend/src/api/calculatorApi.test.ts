import { afterEach, describe, expect, it, vi } from "vitest";
import { calculate, CalculatorApiError } from "./calculatorApi";

describe("calculate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns result on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ result: 5 }),
      }),
    );

    const res = await calculate({ operation: "add", a: 2, b: 3 });
    expect(res.result).toBe(5);
  });

  it("throws CalculatorApiError on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ error: "division by zero" }),
      }),
    );

    await expect(
      calculate({ operation: "divide", a: 1, b: 0 }),
    ).rejects.toBeInstanceOf(CalculatorApiError);
  });
});
