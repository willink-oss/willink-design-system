import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const FullExample = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#prev" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#1" isActive>
          1
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#2">2</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#3">3</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#next" />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);

describe("Pagination", () => {
  it("renders a navigation landmark with an accessible name", () => {
    render(<FullExample />);
    expect(
      screen.getByRole("navigation", { name: "pagination" }),
    ).toBeInTheDocument();
  });

  it("marks the active page with aria-current=page", () => {
    render(<FullExample />);
    const active = screen.getByRole("link", { name: "1" });
    expect(active).toHaveAttribute("aria-current", "page");

    const inactive = screen.getByRole("link", { name: "2" });
    expect(inactive).not.toHaveAttribute("aria-current");
  });

  it("labels the previous and next controls", () => {
    render(<FullExample />);
    expect(
      screen.getByRole("link", { name: "前のページ" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "次のページ" })).toBeInTheDocument();
  });

  it("exposes an sr-only hint inside the ellipsis", () => {
    render(<FullExample />);
    expect(screen.getByText("More pages")).toHaveClass("sr-only");
  });

  it("merges custom className onto the link", () => {
    render(
      <PaginationLink href="#x" className="custom-class">
        9
      </PaginationLink>,
    );
    const link = screen.getByRole("link", { name: "9" });
    expect(link).toHaveClass("custom-class");
    // still carries the inactive (ghost) buttonVariants styling
    expect(link).toHaveClass("text-fg");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<FullExample />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
