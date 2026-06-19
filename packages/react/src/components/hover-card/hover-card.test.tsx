import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

function Sample({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    // wrap in <main> to satisfy axe "region" rule (test artifact only — not a DS concern)
    <main>
      <HoverCard defaultOpen={defaultOpen} openDelay={0} closeDelay={0}>
        <HoverCardTrigger href="https://example.com">@willink</HoverCardTrigger>
        {/* HoverCard content is NOT role="dialog" (sighted-hover affordance),
            so no accessible name is required on the panel itself. */}
        <HoverCardContent>
          <div className="flex gap-3">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-fg">i-Willink</h4>
              <p className="text-sm text-muted">
                Design system & product engineering.
              </p>
              <p className="text-xs text-fg-secondary">Joined 2024</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </main>
  );
}

describe("HoverCard", () => {
  it("trigger is rendered, content closed by default", () => {
    render(<Sample />);
    expect(screen.getByText("@willink")).toBeInTheDocument();
    expect(screen.queryByText("i-Willink")).not.toBeInTheDocument();
  });

  it("opens on pointer hover of the trigger", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.hover(screen.getByText("@willink"));
    expect(await screen.findByText("i-Willink")).toBeInTheDocument();
  });

  it("renders rich content when open", () => {
    render(<Sample defaultOpen />);
    expect(screen.getByText("i-Willink")).toBeInTheDocument();
    expect(
      screen.getByText("Design system & product engineering."),
    ).toBeInTheDocument();
  });

  it("applies motion-reduce:animate-none on content (WCAG 2.3.3)", () => {
    render(<Sample defaultOpen />);
    expect(document.body.innerHTML).toContain("motion-reduce:animate-none");
  });

  it("has no axe a11y violations when open", async () => {
    // Disable region rule: Radix Portal renders content at document body, by
    // design outside the DS's <main> landmark. Not a DS concern.
    const { baseElement } = render(<Sample defaultOpen />);
    await screen.findByText("i-Willink");
    const results = await axe(baseElement, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
