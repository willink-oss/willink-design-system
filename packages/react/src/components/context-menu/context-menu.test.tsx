import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";

function Sample() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>右クリックの対象</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>操作</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>複製する</ContextMenuItem>
        <ContextMenuItem>名前を変更</ContextMenuItem>
        <ContextMenuItem disabled>アーカイブ（権限なし）</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/** Open the menu by dispatching a contextmenu (right-click) on the trigger. */
function openMenu() {
  fireEvent.contextMenu(screen.getByText("右クリックの対象"));
}

describe("ContextMenu", () => {
  it("trigger is rendered when closed", () => {
    render(<Sample />);
    expect(screen.getByText("右クリックの対象")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on right-click (contextmenu)", async () => {
    render(<Sample />);
    openMenu();
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("複製する")).toBeInTheDocument();
    expect(screen.getByText("操作")).toBeInTheDocument();
  });

  it("disabled items expose data-disabled", async () => {
    render(<Sample />);
    openMenu();
    const disabled = await screen.findByText("アーカイブ（権限なし）");
    expect(disabled).toHaveAttribute("data-disabled");
  });

  it("closes on Escape", async () => {
    render(<Sample />);
    openMenu();
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: "Escape",
      code: "Escape",
    });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has no axe a11y violations (open)", async () => {
    render(<Sample />);
    openMenu();
    // Scope axe to the menu subtree: the page-level `region` (landmark) rule is
    // a false positive in a bare test fixture — the consuming app provides
    // landmarks, not this component.
    const menu = await screen.findByRole("menu");
    expect(await axe(menu)).toHaveNoViolations();
  });
});
