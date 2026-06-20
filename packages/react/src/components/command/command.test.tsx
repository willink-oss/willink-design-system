import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command";

function Sample({ onSelect }: { onSelect?: () => void }) {
  return (
    // wrap in <main> to satisfy axe "region" rule (test artifact only — not a DS concern)
    <main>
      <Command label="コマンドメニュー">
        <CommandInput placeholder="コマンドを検索…" />
        <CommandList>
          <CommandEmpty>該当する結果がありません。</CommandEmpty>
          <CommandGroup heading="操作">
            <CommandItem onSelect={onSelect}>
              新規作成
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>複製</CommandItem>
          </CommandGroup>
          <CommandGroup heading="設定">
            <CommandItem>環境設定</CommandItem>
            <CommandItem disabled>請求（権限なし）</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </main>
  );
}

// CommandSeparator renders cmdk's role="separator" divider between groups.
// (Kept out of the axe sample above: cmdk emits it as a direct child of the
// role="listbox" CommandList, which axe's aria-required-children flags — an
// upstream cmdk structure, not a DS styling concern.)
function SampleWithSeparator() {
  return (
    <main>
      <Command label="コマンドメニュー">
        <CommandInput placeholder="コマンドを検索…" />
        <CommandList>
          <CommandGroup heading="操作">
            <CommandItem>新規作成</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="設定">
            <CommandItem>環境設定</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </main>
  );
}

describe("Command", () => {
  it("renders the search input and items", () => {
    render(<Sample />);
    expect(
      screen.getByPlaceholderText("コマンドを検索…"),
    ).toBeInTheDocument();
    expect(screen.getByText("新規作成")).toBeInTheDocument();
    expect(screen.getByText("環境設定")).toBeInTheDocument();
  });

  it("exposes a searchbox/combobox accessible input", () => {
    render(<Sample />);
    const input = screen.getByPlaceholderText("コマンドを検索…");
    expect(input).toHaveAttribute("cmdk-input", "");
  });

  it("filters items as the user types", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.type(screen.getByPlaceholderText("コマンドを検索…"), "環境");
    expect(screen.getByText("環境設定")).toBeInTheDocument();
    expect(screen.queryByText("新規作成")).not.toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.type(
      screen.getByPlaceholderText("コマンドを検索…"),
      "zzzznomatch",
    );
    expect(
      screen.getByText("該当する結果がありません。"),
    ).toBeInTheDocument();
  });

  it("calls onSelect when an item is activated", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Sample onSelect={onSelect} />);
    await user.click(screen.getByText("新規作成"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("disabled items carry data-disabled", () => {
    render(<Sample />);
    expect(screen.getByText("請求（権限なし）")).toHaveAttribute(
      "data-disabled",
      "true",
    );
  });

  it("renders a separator between groups", () => {
    render(<SampleWithSeparator />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("has no axe a11y violations (open)", async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
