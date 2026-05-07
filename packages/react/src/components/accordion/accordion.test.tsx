import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

function Sample({ type }: { type: "single" | "multiple" }) {
  return type === "single" ? (
    <Accordion type="single" collapsible defaultValue="q1">
      <AccordionItem value="q1">
        <AccordionTrigger>Q1</AccordionTrigger>
        <AccordionContent>A1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>Q2</AccordionTrigger>
        <AccordionContent>A2</AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : (
    <Accordion type="multiple" defaultValue={["q1", "q2"]}>
      <AccordionItem value="q1">
        <AccordionTrigger>Q1</AccordionTrigger>
        <AccordionContent>A1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>Q2</AccordionTrigger>
        <AccordionContent>A2</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders triggers as buttons (single mode)", () => {
    render(<Sample type="single" />);
    expect(screen.getByRole("button", { name: /Q1/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Q2/ })).toBeInTheDocument();
  });

  it("opens and closes on click (single mode, collapsible)", async () => {
    const user = userEvent.setup();
    render(<Sample type="single" />);
    // q1 is open by default
    expect(screen.getByRole("button", { name: /Q1/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    // open q2 → q1 closes
    await user.click(screen.getByRole("button", { name: /Q2/ }));
    expect(screen.getByRole("button", { name: /Q2/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: /Q1/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("supports multiple mode (both can be open)", () => {
    render(<Sample type="multiple" />);
    expect(screen.getByRole("button", { name: /Q1/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: /Q2/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("supports keyboard navigation (ArrowDown/Up)", async () => {
    const user = userEvent.setup();
    render(<Sample type="single" />);
    const q1 = screen.getByRole("button", { name: /Q1/ });
    q1.focus();
    expect(document.activeElement).toBe(q1);
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: /Q2/ }));
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(q1);
  });

  it("trigger has hover/focus class names from cn", () => {
    render(<Sample type="single" />);
    const q1 = screen.getByRole("button", { name: /Q1/ });
    expect(q1).toHaveClass("hover:text-brand");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Sample type="single" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
