import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

function Sample({
  side,
  onOpenClick,
}: {
  side?: "top" | "right" | "bottom" | "left";
  onOpenClick?: () => void;
}) {
  return (
    <Sheet>
      <SheetTrigger onClick={onOpenClick}>Open</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetHeader>
        <p>Body content</p>
        <SheetFooter>
          <button>Save</button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("opens on trigger click and renders SheetContent visible", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("sets data-state='open' on Content when opened", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("data-state", "open");
  });

  it("applies left side positioning + slide animation when side='left'", async () => {
    const user = userEvent.setup();
    render(<Sample side="left" />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("left-0");
    expect(dialog).toHaveClass("inset-y-0");
    expect(dialog.className).toMatch(/animate-sheet-in-left/);
  });

  it("trigger reflects aria-expanded state (closed → open)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const trigger = screen.getByRole("button", { name: /Open/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("fires onClick handler on trigger click", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Sample onOpenClick={handler} />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has no axe a11y violations when open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
