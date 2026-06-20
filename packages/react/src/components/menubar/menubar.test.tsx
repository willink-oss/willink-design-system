import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./menubar";

function Sample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>ファイル</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            新規タブ
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>ウィンドウを開く</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>印刷（権限なし）</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>編集</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>元に戻す</MenubarItem>
          <MenubarItem>やり直す</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

describe("Menubar", () => {
  it("triggers are rendered when closed", () => {
    render(<Sample />);
    expect(screen.getByText("ファイル")).toBeInTheDocument();
    expect(screen.getByText("編集")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the menu on trigger click", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByText("ファイル"));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("新規タブ")).toBeInTheDocument();
  });

  it("disabled items expose data-disabled", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByText("ファイル"));
    const disabled = await screen.findByText("印刷（権限なし）");
    expect(disabled).toHaveAttribute("data-disabled");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByText("ファイル"));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has no axe a11y violations (open)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByText("ファイル"));
    // Scope axe to the open menu subtree: the page-level `region` (landmark)
    // rule is a false positive in a bare test fixture — the consuming app
    // provides landmarks, not this component.
    const menu = await screen.findByRole("menu");
    expect(await axe(menu)).toHaveNoViolations();
  });
});
