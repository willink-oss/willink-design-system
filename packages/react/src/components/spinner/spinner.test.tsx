import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders a span with role=status", () => {
    render(<Spinner />);
    const el = screen.getByRole("status");
    expect(el.tagName).toBe("SPAN");
  });

  it("has a default accessible name", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAccessibleName("読み込み中");
  });

  it("allows overriding the aria-label", () => {
    render(<Spinner aria-label="Loading…" />);
    expect(screen.getByRole("status")).toHaveAccessibleName("Loading…");
  });

  it("applies default size (md) with spin + motion-reduce", () => {
    render(<Spinner />);
    const el = screen.getByRole("status");
    expect(el).toHaveClass(
      "size-6",
      "border-2",
      "animate-spin",
      "motion-reduce:animate-none",
    );
  });

  it("applies sm / lg size variants", () => {
    const { rerender } = render(<Spinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("size-4", "border-2");
    rerender(<Spinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("size-8", "border-[3px]");
  });

  it("uses the brand color token by default", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass(
      "text-brand",
      "border-current",
      "border-t-transparent",
    );
  });

  it("merges custom className", () => {
    render(<Spinner className="extra" />);
    expect(screen.getByRole("status")).toHaveClass("extra", "animate-spin");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
