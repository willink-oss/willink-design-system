import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders rect variant (default) with rounded-md + animate-pulse + bg-neutral-200", () => {
    const { container } = render(<Skeleton data-testid="skel" />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).not.toBeNull();
    expect(el).toHaveClass("rounded-md");
    expect(el).toHaveClass("animate-pulse");
    expect(el).toHaveClass("bg-neutral-200");
  });

  it("applies rounded-full when variant='circle'", () => {
    const { container } = render(<Skeleton variant="circle" />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).toHaveClass("rounded-full");
    expect(el).toHaveClass("animate-pulse");
  });

  it("allows className to override size (e.g. h-8 w-8)", () => {
    const { container } = render(<Skeleton className="h-8 w-8" />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).toHaveClass("h-8");
    expect(el).toHaveClass("w-8");
  });

  it("has no axe a11y violations", async () => {
    const { baseElement } = render(<Skeleton className="h-4 w-32" />);
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
