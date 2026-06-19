import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Button } from "../button";
import { ButtonGroup } from "./button-group";

describe("ButtonGroup", () => {
  it("renders a div with role group", () => {
    render(
      <ButtonGroup>
        <Button variant="outline">A</Button>
        <Button variant="outline">B</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group.tagName).toBe("DIV");
  });

  it("applies horizontal orientation by default", () => {
    render(
      <ButtonGroup>
        <Button variant="outline">A</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group).toHaveClass(
      "inline-flex",
      "flex-row",
      "isolate",
      "[&>button:not(:first-child)]:-ml-px",
    );
  });

  it("applies vertical orientation variant", () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button variant="outline">A</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group");
    expect(group).toHaveClass(
      "flex-col",
      "[&>button:not(:first-child)]:-mt-px",
    );
  });

  it("merges custom className", () => {
    render(
      <ButtonGroup className="extra">
        <Button variant="outline">A</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("group")).toHaveClass("extra", "isolate");
  });

  it("renders its Button children", () => {
    render(
      <ButtonGroup>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "Left" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Right" })).toBeInTheDocument();
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(
      <ButtonGroup aria-label="Text alignment">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
