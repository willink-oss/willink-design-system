import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";

function Sample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
            <NavigationMenuLink href="/billing">Billing</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe("NavigationMenu", () => {
  it("renders the nav landmark with triggers and top-level links", () => {
    render(<Sample />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Products/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Docs/ })).toBeInTheDocument();
  });

  it("content is closed by default", () => {
    render(<Sample />);
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
  });

  it("opens content on trigger click", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Products/ }));
    expect(await screen.findByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
  });

  it("applies the ghost-like trigger style (data-[state=open]:bg-surface-subtle)", () => {
    render(<Sample />);
    const trigger = screen.getByRole("button", { name: /Products/ });
    expect(trigger.className).toContain("data-[state=open]:bg-surface-subtle");
  });

  it("navigationMenuTriggerStyle emits the focus-visible ring + ghost hover", () => {
    const cls = navigationMenuTriggerStyle();
    expect(cls).toContain("rounded-full");
    expect(cls).toContain("hover:bg-surface-subtle");
    expect(cls).toContain("focus-visible:ring-ring");
  });

  it("applies motion-reduce:animate-none on content (WCAG 2.3.3)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Products/ }));
    await screen.findByText("Analytics");
    expect(document.body.innerHTML).toContain("motion-reduce:animate-none");
  });

  it("has no axe a11y violations when open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Products/ }));
    await screen.findByText("Analytics");
    expect(await axe(container)).toHaveNoViolations();
  });
});
