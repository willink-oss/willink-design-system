import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

function Sample({ onSelect }: { onSelect?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSelect}>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem disabled>Billing (disabled)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("trigger is rendered when closed", () => {
    render(<Sample />);
    expect(screen.getByRole("button", { name: /Open menu/ })).toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open menu/ }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("calls onSelect when item clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Sample onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: /Open menu/ }));
    await user.click(await screen.findByText("Profile"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("disabled items are not clickable", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open menu/ }));
    const disabled = await screen.findByText("Billing (disabled)");
    expect(disabled).toHaveAttribute("data-disabled");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open menu/ }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has no axe a11y violations (open)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Open menu/ }));
    // Scope axe to the menu subtree: the page-level `region` (landmark) rule is
    // a false positive in a bare test fixture — the consuming app provides
    // landmarks, not this component.
    const menu = await screen.findByRole("menu");
    expect(await axe(menu)).toHaveNoViolations();
  });
});
