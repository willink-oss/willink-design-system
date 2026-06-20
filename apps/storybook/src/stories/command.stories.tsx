import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@willink-labs/react";

const meta = {
  title: "Components/Command",
  component: Command,
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command label="コマンドメニュー" className="w-96">
      <CommandInput placeholder="コマンドを検索…" />
      <CommandList>
        <CommandEmpty>該当する結果がありません。</CommandEmpty>
        <CommandGroup heading="候補">
          <CommandItem>カレンダー</CommandItem>
          <CommandItem>絵文字を検索</CommandItem>
          <CommandItem>計算機</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithGroupsAndShortcuts: Story = {
  render: () => (
    <Command label="コマンドメニュー" className="w-96">
      <CommandInput placeholder="コマンドまたは検索語を入力…" />
      <CommandList>
        <CommandEmpty>該当する結果がありません。</CommandEmpty>
        <CommandGroup heading="操作">
          <CommandItem>
            新規ファイル
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            ファイルを開く
            <CommandShortcut>⌘O</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="設定">
          <CommandItem>
            環境設定
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
          <CommandItem disabled>請求（権限なし）</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
