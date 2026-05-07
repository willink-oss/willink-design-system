import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="message" />);
    expect(screen.getByPlaceholderText("message")).toBeInTheDocument();
  });

  it("applies semantic token classes", () => {
    render(<Textarea data-testid="x" />);
    expect(screen.getByTestId("x")).toHaveClass(
      "border-border",
      "bg-bg",
      "text-fg",
      "min-h-20",
      "resize-y",
    );
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("respects rows attribute", () => {
    render(<Textarea data-testid="x" rows={5} />);
    expect(screen.getByTestId("x")).toHaveAttribute("rows", "5");
  });

  it("supports aria-invalid", () => {
    render(<Textarea data-testid="x" aria-invalid />);
    expect(screen.getByTestId("x")).toHaveAttribute("aria-invalid", "true");
  });

  it("respects disabled prop", () => {
    render(<Textarea disabled data-testid="x" />);
    expect(screen.getByTestId("x")).toBeDisabled();
  });

  it("has no axe a11y violations with associated label", async () => {
    const { container } = render(
      <>
        <label htmlFor="msg">Message</label>
        <Textarea id="msg" />
      </>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
