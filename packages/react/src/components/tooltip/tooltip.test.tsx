import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

function Sample() {
  return (
    // wrap in <main> to satisfy axe "region" rule (test artifact only — not a DS concern)
    <main>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Help text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </main>
  );
}

describe("Tooltip", () => {
  it("trigger is rendered", () => {
    render(<Sample />);
    expect(screen.getByRole("button", { name: /Hover me/ })).toBeInTheDocument();
  });

  it("shows content on hover (text is inside tooltip role)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.hover(screen.getByRole("button", { name: /Hover me/ }));
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Help text");
  });

  it("shows content on keyboard focus (a11y)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const trigger = screen.getByRole("button", { name: /Hover me/ });
    await user.tab();
    expect(document.activeElement).toBe(trigger);
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("has no axe a11y violations when open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Sample />);
    await user.hover(screen.getByRole("button", { name: /Hover me/ }));
    await screen.findByRole("tooltip");
    // Disable region rule: Radix Tooltip Portal renders content at document body
    // which is by design outside the DS's <main> landmark. Not a DS concern.
    const results = await axe(baseElement, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
