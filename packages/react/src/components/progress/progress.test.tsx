import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Progress } from "./progress";

describe("Progress", () => {
  it("renders with progressbar role", () => {
    render(<Progress value={50} aria-label="upload" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("reflects value via data-value (Radix sets data-value, not aria-valuenow directly)", () => {
    render(<Progress value={75} aria-label="upload" />);
    const bar = screen.getByRole("progressbar");
    // Radix Progress.Root sets data-value attribute
    expect(bar).toHaveAttribute("data-value", "75");
    expect(bar).toHaveAttribute("data-state", "loading");
  });

  it("indeterminate when no value provided", () => {
    render(<Progress aria-label="loading" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-state",
      "indeterminate",
    );
  });

  it("complete state when value === max", () => {
    render(<Progress value={100} max={100} aria-label="done" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "data-state",
      "complete",
    );
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Progress value={50} aria-label="upload progress" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
