import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function Sample() {
  return (
    // wrap in <main> to satisfy axe "region" rule (test artifact only — not a DS concern)
    <main>
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        {/* Radix gives Content role="dialog" → it MUST have an accessible name
            (aria-label or aria-labelledby), like DialogTitle does for Dialog. */}
        <PopoverContent aria-label="詳細設定">
          <p>Popover body content</p>
        </PopoverContent>
      </Popover>
    </main>
  );
}

describe("Popover", () => {
  it("trigger is rendered, content closed by default", () => {
    render(<Sample />);
    expect(
      screen.getByRole("button", { name: /Open popover/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Popover body content")).not.toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open popover/ }));
    expect(await screen.findByText("Popover body content")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open popover/ }));
    expect(await screen.findByText("Popover body content")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(
      screen.queryByText("Popover body content"),
    ).not.toBeInTheDocument();
  });

  it("applies motion-reduce:animate-none on content (WCAG 2.3.3)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open popover/ }));
    await screen.findByText("Popover body content");
    expect(document.body.innerHTML).toContain("motion-reduce:animate-none");
  });

  it("has no axe a11y violations when open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open popover/ }));
    await screen.findByText("Popover body content");
    // Disable region rule: Radix Portal renders content at document body, by
    // design outside the DS's <main> landmark. Not a DS concern.
    const results = await axe(baseElement, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
