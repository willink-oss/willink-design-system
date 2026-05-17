import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Sample({
  size,
  closeButton,
}: {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeButton?: false;
}) {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent size={size} closeButton={closeButton}>
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription>Are you sure?</DialogDescription>
        </DialogHeader>
        <p>Body content</p>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <button>OK</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("trigger button is rendered when closed", () => {
    render(<Sample />);
    expect(screen.getByRole("button", { name: /Open/ })).toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via the default ✕ close button", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    await user.click(screen.getByRole("button", { name: /Close/ }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes via DialogClose explicit child", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    await user.click(screen.getByRole("button", { name: /Cancel/ }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hides default close button when closeButton={false}", async () => {
    const user = userEvent.setup();
    render(<Sample closeButton={false} />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    expect(screen.queryByRole("button", { name: /Close/ })).not.toBeInTheDocument();
  });

  it("applies size variant max-width class (lg = max-w-lg)", async () => {
    const user = userEvent.setup();
    const { container } = render(<Sample size="lg" />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const content = container.ownerDocument.querySelector('[role="dialog"]');
    expect(content).toHaveClass("max-w-lg");
  });

  it("default size is md (max-w-md)", async () => {
    const user = userEvent.setup();
    const { container } = render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const content = container.ownerDocument.querySelector('[role="dialog"]');
    expect(content).toHaveClass("max-w-md");
  });

  it("title is exposed to screen readers via aria-labelledby (Radix default)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby");
  });

  it("applies motion-reduce:animate-none on overlay + content (WCAG 2.3.3)", async () => {
    const user = userEvent.setup();
    const { container } = render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const content = container.ownerDocument.querySelector('[role="dialog"]');
    expect(content).toHaveClass("motion-reduce:animate-none");
  });

  it("has no axe a11y violations when open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open/ }));
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
