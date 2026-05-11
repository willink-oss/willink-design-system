import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Separator } from "./separator";

describe("Separator", () => {
  it("renders horizontal divider by default", () => {
    const { container } = render(<Separator />);
    const sep = container.firstChild as HTMLElement;
    expect(sep).toHaveClass("h-px");
    expect(sep).toHaveClass("w-full");
  });

  it("renders vertical divider when orientation=vertical", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const sep = container.firstChild as HTMLElement;
    expect(sep).toHaveClass("w-px");
    expect(sep).toHaveClass("h-full");
  });

  it("uses bg-border by default", () => {
    const { container } = render(<Separator />);
    const sep = container.firstChild as HTMLElement;
    expect(sep).toHaveClass("bg-border");
  });

  it("has no axe a11y violations (decorative)", async () => {
    const { container } = render(
      <main>
        <p>Top</p>
        <Separator decorative />
        <p>Bottom</p>
      </main>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
