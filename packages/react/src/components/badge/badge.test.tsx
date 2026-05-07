import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders a span by default", () => {
    render(<Badge>NEW</Badge>);
    const el = screen.getByText("NEW");
    expect(el.tagName).toBe("SPAN");
  });

  it("applies default variant (brand subtle)", () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("bg-brand-100", "text-brand-700");
  });

  it("applies success variant with semantic color tokens", () => {
    render(<Badge variant="success">Done</Badge>);
    const el = screen.getByText("Done");
    expect(el).toHaveClass("text-success");
  });

  it("applies warning / danger variants", () => {
    const { rerender } = render(<Badge variant="warning">!</Badge>);
    expect(screen.getByText("!")).toHaveClass("text-warning");
    rerender(<Badge variant="danger">x</Badge>);
    expect(screen.getByText("x")).toHaveClass("text-danger");
  });

  it("applies outline variant", () => {
    render(<Badge variant="outline">o</Badge>);
    expect(screen.getByText("o")).toHaveClass("border-border", "text-fg");
  });

  it("merges custom className", () => {
    render(<Badge className="extra">x</Badge>);
    expect(screen.getByText("x")).toHaveClass("extra", "bg-brand-100");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Badge>OK</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
