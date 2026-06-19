import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup", () => {
  it("renders a toolbar with toggle buttons (type=multiple)", () => {
    render(
      <ToggleGroup type="multiple" aria-label="文字書式">
        <ToggleGroupItem value="bold" aria-label="太字">
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="斜体">
          I
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="下線">
          U
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(
      screen.getByRole("toolbar", { name: "文字書式" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("renders a radiogroup with radio items (type=single)", () => {
    render(
      <ToggleGroup type="single" aria-label="配置">
        <ToggleGroupItem value="left" aria-label="左">
          L
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="中央">
          C
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="右">
          R
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(
      screen.getByRole("radiogroup", { name: "配置" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("toggles an item on when clicked (type=single)", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="bold" aria-label="太字">
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="斜体">
          I
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const bold = screen.getByRole("radio", { name: "太字" });
    expect(bold).toHaveAttribute("data-state", "off");

    await user.click(bold);
    expect(bold).toHaveAttribute("data-state", "on");
  });

  it("allows multiple items pressed (type=multiple)", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" aria-label="太字">
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="斜体">
          I
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const bold = screen.getByRole("button", { name: "太字" });
    const italic = screen.getByRole("button", { name: "斜体" });

    await user.click(bold);
    await user.click(italic);

    expect(bold).toHaveAttribute("data-state", "on");
    expect(italic).toHaveAttribute("data-state", "on");
  });

  it("propagates variant/size from root to items via context", () => {
    render(
      <ToggleGroup type="single" variant="outline" size="sm">
        <ToggleGroupItem value="bold" aria-label="太字">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const item = screen.getByRole("radio", { name: "太字" });
    expect(item).toHaveClass("border");
    expect(item).toHaveClass("h-8");
  });

  it("lets an item override the root variant/size", () => {
    render(
      <ToggleGroup type="single" variant="outline" size="sm">
        <ToggleGroupItem value="a" aria-label="A" variant="default" size="lg">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    // item A overrides → default variant (no border) + lg (h-12)
    const a = screen.getByRole("radio", { name: "A" });
    expect(a).not.toHaveClass("border");
    expect(a).toHaveClass("h-12");
    // item B inherits the root → outline (border) + sm (h-8)
    const b = screen.getByRole("radio", { name: "B" });
    expect(b).toHaveClass("border");
    expect(b).toHaveClass("h-8");
  });

  it("merges custom className on root and item", () => {
    render(
      <ToggleGroup type="multiple" className="custom-root">
        <ToggleGroupItem value="bold" aria-label="太字" className="custom-item">
          B
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole("toolbar")).toHaveClass("custom-root");
    expect(screen.getByRole("button", { name: "太字" })).toHaveClass(
      "custom-item",
    );
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(
      <ToggleGroup type="single" aria-label="文字書式">
        <ToggleGroupItem value="bold" aria-label="太字">
          B
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="斜体">
          I
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="下線">
          U
        </ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
