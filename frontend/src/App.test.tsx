import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import * as api from "./api/calculatorApi";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("App", () => {
  it("shows validation error for invalid input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByLabelText("First operand"));
    await user.click(screen.getByRole("button", { name: /calculate/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("displays result from API", async () => {
    vi.spyOn(api, "calculate").mockResolvedValue({ result: 7 });
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByLabelText("First operand"));
    await user.type(screen.getByLabelText("First operand"), "3");
    await user.clear(screen.getByLabelText("Second operand"));
    await user.type(screen.getByLabelText("Second operand"), "4");
    await user.click(screen.getByRole("button", { name: /calculate/i }));

    expect(await screen.findByText("7")).toBeInTheDocument();
  });
});
