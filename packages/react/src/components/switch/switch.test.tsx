import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Switch } from "./switch";

describe("Switch", () => {
  it("renders with switch role", () => {
    render(<Switch aria-label="toggle" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="toggle" />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("respects defaultChecked prop", () => {
    render(<Switch defaultChecked aria-label="toggle" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    let last: boolean | null = null;
    render(<Switch aria-label="toggle" onCheckedChange={(v) => (last = v)} />);
    await user.click(screen.getByRole("switch"));
    expect(last).toBe(true);
  });

  it("can be disabled", async () => {
    const user = userEvent.setup();
    render(<Switch disabled aria-label="toggle" />);
    const sw = screen.getByRole("switch");
    expect(sw).toBeDisabled();
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Switch aria-label="enable notifications" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
