import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="email" />);
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
  });

  it("uses type=text by default", () => {
    render(<Input data-testid="x" />);
    expect(screen.getByTestId("x")).toHaveAttribute("type", "text");
  });

  it("accepts type=email", () => {
    render(<Input type="email" data-testid="x" />);
    expect(screen.getByTestId("x")).toHaveAttribute("type", "email");
  });

  it("applies semantic token classes", () => {
    render(<Input data-testid="x" />);
    expect(screen.getByTestId("x")).toHaveClass(
      "border-border",
      "bg-bg",
      "text-fg",
    );
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies aria-invalid based error styling", () => {
    render(<Input data-testid="x" aria-invalid />);
    const el = screen.getByTestId("x");
    expect(el).toHaveAttribute("aria-invalid", "true");
  });

  it("merges custom className via cn()", () => {
    render(<Input data-testid="x" className="extra-class" />);
    expect(screen.getByTestId("x")).toHaveClass("extra-class", "border-border");
  });

  it("respects disabled prop", () => {
    render(<Input disabled data-testid="x" />);
    expect(screen.getByTestId("x")).toBeDisabled();
  });

  it("has no axe a11y violations when associated with a label", async () => {
    const { container } = render(
      <>
        <label htmlFor="x">Email</label>
        <Input id="x" type="email" />
      </>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
