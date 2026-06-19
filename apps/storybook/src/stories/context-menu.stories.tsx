import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@willink-labs/react";

const meta = {
  title: "Components/ContextMenu",
  component: ContextMenu,
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerSurface =
  "flex h-40 w-72 select-none items-center justify-center rounded-md border border-dashed border-border bg-surface-subtle text-sm text-fg-secondary";

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerSurface}>
        ここを右クリック
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>複製する</ContextMenuItem>
        <ContextMenuItem>名前を変更</ContextMenuItem>
        <ContextMenuItem>ログを表示</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithLabelAndShortcuts: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerSurface}>
        ファイルを右クリック
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-56">
        <ContextMenuLabel>report-2026.pdf</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            開く
            <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            複製する
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-danger">
          削除する
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className={triggerSurface}>
        操作を右クリック
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>複製する</ContextMenuItem>
        <ContextMenuItem disabled>アーカイブ（権限なし）</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-danger">削除する</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
