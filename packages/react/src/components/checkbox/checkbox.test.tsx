import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders with checkbox role", () => {
    render(<Checkbox aria-label="agree" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="agree" />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toHaveAttribute("aria-checked", "false");
    await user.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "true");
  });

  it("respects defaultChecked prop", () => {
    render(<Checkbox defaultChecked aria-label="agree" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    let last: unknown = null;
    render(<Checkbox aria-label="agree" onCheckedChange={(v) => (last = v)} />);
    await user.click(screen.getByRole("checkbox"));
    expect(last).toBe(true);
  });

  it("can be disabled", async () => {
    const user = userEvent.setup();
    render(<Checkbox disabled aria-label="agree" />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toBeDisabled();
    await user.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "false");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Checkbox aria-label="同意する" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
