import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Kbd } from "./kbd";

describe("Kbd", () => {
  it("renders a <kbd> element", () => {
    render(<Kbd>Esc</Kbd>);
    const el = screen.getByText("Esc");
    expect(el.tagName).toBe("KBD");
  });

  it("applies default size (sm) with mono + semantic tokens", () => {
    render(<Kbd>K</Kbd>);
    const el = screen.getByText("K");
    expect(el).toHaveClass(
      "text-xs",
      "font-mono",
      "border-border",
      "bg-surface-subtle",
      "text-fg",
    );
  });

  it("applies md size", () => {
    render(<Kbd size="md">⌘</Kbd>);
    expect(screen.getByText("⌘")).toHaveClass("text-sm");
  });

  it("merges custom className", () => {
    render(<Kbd className="extra">x</Kbd>);
    expect(screen.getByText("x")).toHaveClass("extra", "bg-surface-subtle");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Kbd>Enter</Kbd>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
