import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Alert } from "./alert";

describe("Alert", () => {
  it("renders a div with role=alert by default", () => {
    render(<Alert>Heads up</Alert>);
    const el = screen.getByRole("alert");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveTextContent("Heads up");
  });

  it("applies default info variant with semantic brand-soft tokens", () => {
    render(<Alert>info</Alert>);
    expect(screen.getByRole("alert")).toHaveClass(
      "bg-brand-soft",
      "text-brand-soft-fg",
      "border-brand-soft",
    );
  });

  it("applies success variant with semantic color tokens", () => {
    render(<Alert variant="success">done</Alert>);
    const el = screen.getByRole("alert");
    expect(el).toHaveClass("bg-success/10", "text-success", "border-success/30");
  });

  it("applies warning / danger variants", () => {
    const { rerender } = render(<Alert variant="warning">!</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-warning", "border-warning/30");
    rerender(<Alert variant="danger">x</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("text-danger", "border-danger/30");
  });

  it("allows role override to status for non-urgent messages", () => {
    render(<Alert role="status">polite</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("polite");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("merges custom className", () => {
    render(<Alert className="extra">x</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("extra", "bg-brand-soft");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Alert>Operation completed.</Alert>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
