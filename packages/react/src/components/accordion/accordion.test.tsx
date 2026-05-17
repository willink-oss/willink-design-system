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

  describe("AccordionItem variants", () => {
    it("defaults to flat variant (border-b・後方互換)", () => {
      const { container } = render(<Sample type="single" />);
      const items = container.querySelectorAll("[data-state]");
      // First Item has border-b class for flat
      expect(items[0]).toHaveClass("border-b");
    });

    it("supports card variant (rounded + shadow)", () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="q1" variant="card">
            <AccordionTrigger>Q1</AccordionTrigger>
            <AccordionContent>A1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      const item = container.querySelector("[data-state]");
      expect(item).toHaveClass("rounded-xl");
      expect(item).toHaveClass("shadow-soft");
      expect(item).not.toHaveClass("border-b");
    });

    it("supports bordered variant", () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="q1" variant="bordered">
            <AccordionTrigger>Q1</AccordionTrigger>
            <AccordionContent>A1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      const item = container.querySelector("[data-state]");
      expect(item).toHaveClass("rounded-md");
      expect(item).toHaveClass("border");
      expect(item).not.toHaveClass("border-b");
    });
  });

  describe("AccordionTrigger icon prop", () => {
    it("defaults to ChevronDown (後方互換・rotates on open)", () => {
      const { container } = render(<Sample type="single" />);
      // ChevronDown is a lucide svg
      const svg = container.querySelector("button svg");
      expect(svg).not.toBeNull();
      expect(svg).toHaveClass("group-data-[state=open]/trigger:rotate-180");
    });

    it("renders custom icon when icon prop is provided", () => {
      const { getByTestId } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger icon={<span data-testid="custom-icon">+</span>}>
              Q1
            </AccordionTrigger>
            <AccordionContent>A1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      expect(getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("does not render default ChevronDown when custom icon provided", () => {
      const { container } = render(
        <Accordion type="single" collapsible>
          <AccordionItem value="q1">
            <AccordionTrigger icon={<span data-testid="custom-icon">+</span>}>
              Q1
            </AccordionTrigger>
            <AccordionContent>A1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );
      // No svg should remain (lucide ChevronDown is a svg)
      expect(container.querySelector("button svg")).toBeNull();
    });

    it("trigger has group/trigger class for state-aware descendants", () => {
      render(<Sample type="single" />);
      const q1 = screen.getByRole("button", { name: /Q1/ });
      expect(q1).toHaveClass("group/trigger");
    });
  });

  describe("motion (a11y WCAG 2.3.3)", () => {
    it("chevron has motion-reduce:transition-none", () => {
      const { container } = render(<Sample type="single" />);
      const svg = container.querySelector("button svg");
      expect(svg).toHaveClass("motion-reduce:transition-none");
    });

    it("content has motion-reduce:animate-none", () => {
      render(<Sample type="single" />);
      // AccordionContent wraps the inner padding div which contains "A1"
      const a1 = screen.getByText("A1");
      const accordionContent = a1.parentElement;
      expect(accordionContent).toHaveClass("motion-reduce:animate-none");
    });
  });
});
