import type { ApiError, CalculateRequest, CalculateResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export class CalculatorApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "CalculatorApiError";
  }
}

export async function calculate(
  request: CalculateRequest,
): Promise<CalculateResponse> {
  const response = await fetch(`${API_BASE}/api/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const body = (await response.json()) as CalculateResponse | ApiError;

  if (!response.ok) {
    const message =
      "error" in body ? body.error : `Request failed (${response.status})`;
    throw new CalculatorApiError(message, response.status);
  }

  return body as CalculateResponse;
}
