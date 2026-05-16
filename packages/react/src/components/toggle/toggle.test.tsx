import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Toggle } from "./toggle";

describe("Toggle", () => {
  it("renders with default state off", () => {
    render(<Toggle aria-label="Toggle bold">B</Toggle>);
    const toggle = screen.getByRole("button", { name: "Toggle bold" });
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("toggles to on when clicked", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Toggle italic">I</Toggle>);
    const toggle = screen.getByRole("button", { name: "Toggle italic" });

    await user.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "on");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("respects controlled pressed prop", () => {
    render(<Toggle aria-label="Pinned" pressed>📌</Toggle>);
    expect(screen.getByRole("button", { name: "Pinned" })).toHaveAttribute(
      "data-state",
      "on",
    );
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(
      <Toggle aria-label="Disabled toggle" disabled>
        X
      </Toggle>,
    );
    const toggle = screen.getByRole("button", { name: "Disabled toggle" });

    await user.click(toggle);
    expect(toggle).toHaveAttribute("data-state", "off");
  });

  it("applies outline variant classes", () => {
    render(
      <Toggle aria-label="Outline" variant="outline">
        O
      </Toggle>,
    );
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("border");
  });
});
