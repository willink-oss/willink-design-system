import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders a div with default variant classes", () => {
    render(<Card data-testid="card">content</Card>);
    const el = screen.getByTestId("card");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("rounded-xl", "border", "border-border", "bg-bg");
  });

  it("applies elevated variant with shadow", () => {
    render(<Card data-testid="card" variant="elevated">x</Card>);
    expect(screen.getByTestId("card")).toHaveClass("shadow-soft");
  });

  it("merges custom className", () => {
    render(<Card data-testid="card" className="extra">x</Card>);
    expect(screen.getByTestId("card")).toHaveClass("extra", "rounded-xl");
  });

  it("compound: CardHeader / CardTitle / CardDescription / CardContent / CardFooter", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Title").tagName).toBe("H3");
    expect(screen.getByText("Desc").tagName).toBe("P");
    expect(screen.getByText("Desc")).toHaveClass("text-muted");
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("CardTitle renders an h3 with semantic typography", () => {
    render(<CardTitle>Hello</CardTitle>);
    expect(screen.getByText("Hello")).toHaveClass(
      "text-2xl",
      "font-semibold",
      "tracking-tight",
    );
  });

  it("has no axe a11y violations (rendered as a card)", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>月額</CardDescription>
        </CardHeader>
        <CardContent>¥3,000</CardContent>
      </Card>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
