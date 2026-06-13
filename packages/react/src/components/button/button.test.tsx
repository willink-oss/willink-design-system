import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders a button element by default", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn.tagName).toBe("BUTTON");
  });

  it("applies default variant + md size classes", () => {
    render(<Button>OK</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("bg-brand", "text-brand-fg", "rounded-full", "h-10");
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("border", "border-border", "bg-bg", "text-fg");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("text-fg");
    expect(btn).not.toHaveClass("bg-brand");
  });

  it("applies link variant with a flipping foreground role (ADR-0017 #58)", () => {
    render(<Button variant="link">Link</Button>);
    const btn = screen.getByRole("button");
    // Resting color is text-brand-soft-fg (flips: brand-700 light / brand-300
    // dark), not the mode-invariant text-brand (brand-600) which failed AA on
    // the dark page background (3.54:1). Hover keeps text-brand-hover (flips).
    expect(btn).toHaveClass("text-brand-soft-fg", "underline-offset-4");
    expect(btn).toHaveClass("hover:text-brand-hover");
    expect(btn).not.toHaveClass("text-brand");
  });

  it("supports sm/md/lg sizes", () => {
    const { rerender } = render(<Button size="sm">x</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8");
    rerender(<Button size="lg">x</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-14");
  });

  it("renders as <a> when asChild is true and child is <a>", () => {
    render(
      <Button asChild>
        <a href="/foo">link</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "link" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveClass("bg-brand");
  });

  it("respects disabled prop", () => {
    render(<Button disabled>x</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("merges additional className via cn()", () => {
    render(<Button className="extra-class">x</Button>);
    expect(screen.getByRole("button")).toHaveClass("extra-class", "bg-brand");
  });

  it("has no axe a11y violations (default)", async () => {
    const { container } = render(<Button>Click</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
