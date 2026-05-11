import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Slider } from "./slider";

describe("Slider", () => {
  it("renders with single value (one thumb)", () => {
    render(<Slider defaultValue={[50]} max={100} aria-label="volume" />);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
  });

  it("renders with range value (two thumbs)", () => {
    render(<Slider defaultValue={[20, 80]} max={100} aria-label="range" />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("respects min / max / step", () => {
    render(<Slider defaultValue={[5]} min={0} max={10} step={1} aria-label="volume" />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "10");
    expect(thumb).toHaveAttribute("aria-valuenow", "5");
  });

  it("can be disabled (data-disabled propagated to root)", () => {
    const { container } = render(
      <Slider defaultValue={[50]} disabled aria-label="volume" />,
    );
    // Radix sets data-disabled on the root span; thumb does not get HTML `disabled`
    const root = container.querySelector('[data-orientation="horizontal"][data-disabled]');
    expect(root).not.toBeNull();
  });
});
