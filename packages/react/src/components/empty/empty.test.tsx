import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Empty } from "./empty";

describe("Empty", () => {
  it("renders a div with its children", () => {
    render(<Empty>No results found</Empty>);
    const el = screen.getByText("No results found");
    expect(el.tagName).toBe("DIV");
  });

  it("applies the centered column layout + muted foreground", () => {
    render(<Empty>nothing here</Empty>);
    const el = screen.getByText("nothing here");
    expect(el).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "text-center",
      "text-fg-secondary",
    );
  });

  it("applies the default (md) size padding", () => {
    render(<Empty>empty</Empty>);
    expect(screen.getByText("empty")).toHaveClass("py-12", "max-w-sm");
  });

  it("applies sm / lg size variants", () => {
    const { rerender } = render(<Empty size="sm">x</Empty>);
    expect(screen.getByText("x")).toHaveClass("py-8", "max-w-xs");
    rerender(<Empty size="lg">x</Empty>);
    expect(screen.getByText("x")).toHaveClass("py-16", "max-w-md");
  });

  it("merges custom className", () => {
    render(<Empty className="extra">x</Empty>);
    expect(screen.getByText("x")).toHaveClass("extra", "text-fg-secondary");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(
      <Empty>
        <h3>No projects yet</h3>
        <p className="text-muted">Create your first project to get started.</p>
      </Empty>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
