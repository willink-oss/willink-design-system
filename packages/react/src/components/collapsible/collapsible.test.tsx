import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

function Sample({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    // wrap in <main> to satisfy axe "region" rule (test artifact only — not a DS concern)
    <main>
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger>Show notification settings</CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-1">
          <p>Email digest</p>
          <p>Push alerts</p>
        </CollapsibleContent>
      </Collapsible>
    </main>
  );
}

describe("Collapsible", () => {
  it("trigger exposes aria-expanded reflecting open state", () => {
    render(<Sample defaultOpen />);
    const trigger = screen.getByRole("button", {
      name: "Show notification settings",
    });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders content when open", () => {
    render(<Sample defaultOpen />);
    expect(screen.getByText("Email digest")).toBeInTheDocument();
    expect(screen.getByText("Push alerts")).toBeInTheDocument();
  });

  it("closed by default — content hidden, aria-expanded false", () => {
    render(<Sample />);
    expect(
      screen.getByRole("button", { name: "Show notification settings" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Email digest")).not.toBeInTheDocument();
  });

  it("merges custom className onto content via cn()", () => {
    render(<Sample defaultOpen />);
    // CollapsibleContent base class + consumer class are both present
    const content = screen.getByText("Email digest").parentElement;
    expect(content).toHaveClass("text-sm", "text-fg", "mt-2", "space-y-1");
  });

  it("has no axe a11y violations when open", async () => {
    const { container } = render(<Sample defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
