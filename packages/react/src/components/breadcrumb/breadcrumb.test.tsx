import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

const FullExample = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/library">Library</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Data</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

describe("Breadcrumb", () => {
  it("renders a navigation landmark named breadcrumb", () => {
    render(<FullExample />);
    expect(
      screen.getByRole("navigation", { name: "breadcrumb" }),
    ).toBeInTheDocument();
  });

  it("renders an ordered list of items", () => {
    render(<FullExample />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders ancestor links with hrefs", () => {
    render(<FullExample />);
    const home = screen.getByRole("link", { name: "Home" });
    expect(home).toHaveAttribute("href", "/");
    const library = screen.getByRole("link", { name: "Library" });
    expect(library).toHaveAttribute("href", "/library");
  });

  it("marks the current page with aria-current=page and aria-disabled", () => {
    render(<FullExample />);
    const current = screen.getByText("Data");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("aria-disabled", "true");
    // current page is not a real navigable link
    expect(current).not.toHaveAttribute("href");
  });

  it("hides separators from the accessibility tree", () => {
    render(<FullExample />);
    const list = screen.getByRole("list");
    const separators = list.querySelectorAll('[role="presentation"]');
    expect(separators).toHaveLength(2);
    separators.forEach((sep) => {
      expect(sep).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("merges custom className onto the link", () => {
    render(
      <BreadcrumbLink href="#x" className="custom-class">
        Docs
      </BreadcrumbLink>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveClass("custom-class");
    expect(link).toHaveClass("transition-colors");
  });

  it("supports asChild rendering on the link", () => {
    render(
      <BreadcrumbLink asChild>
        <button type="button">Settings</button>
      </BreadcrumbLink>,
    );
    const trigger = screen.getByRole("button", { name: "Settings" });
    expect(trigger).toHaveClass("transition-colors");
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<FullExample />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
