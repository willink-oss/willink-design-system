import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Label } from "./label";

describe("Label", () => {
  it("renders a label element", () => {
    render(<Label htmlFor="x">Email</Label>);
    expect(screen.getByText("Email").tagName).toBe("LABEL");
  });

  it("forwards htmlFor prop", () => {
    render(<Label htmlFor="email">Email</Label>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email");
  });

  it("applies size variants", () => {
    const { rerender } = render(<Label size="sm">x</Label>);
    expect(screen.getByText("x")).toHaveClass("text-sm");
    rerender(<Label size="md">x</Label>);
    expect(screen.getByText("x")).toHaveClass("text-base");
  });

  it("renders required asterisk when required=true", () => {
    render(<Label required>Name</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveClass("text-danger");
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("does NOT render asterisk by default", () => {
    render(<Label>Name</Label>);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Label className="extra">x</Label>);
    expect(screen.getByText("x")).toHaveClass("extra", "font-medium");
  });

  it("has no axe a11y violations when paired with input", async () => {
    const { container } = render(
      <>
        <Label htmlFor="email" required>
          Email
        </Label>
        <input id="email" type="email" />
      </>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
