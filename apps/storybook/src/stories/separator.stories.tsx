import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "@willink-labs/react";

const meta = {
  title: "Components/Separator",
  component: Separator,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">
          Willink Design System
        </h4>
        <p className="text-sm text-muted">
          アクセシブルな UI コンポーネント集。
        </p>
      </div>
      <Separator className="my-4" />
      <p className="text-sm">セクションの区切りとして使用します。</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center gap-4 text-sm">
      <span>ブログ</span>
      <Separator orientation="vertical" />
      <span>ドキュメント</span>
      <Separator orientation="vertical" />
      <span>お問い合わせ</span>
    </div>
  ),
};

export const Semantic: Story = {
  render: () => (
    <div className="w-80 text-sm">
      <p>前のセクションの本文です。</p>
      {/* decorative={false} で role="separator" として支援技術に伝える */}
      <Separator decorative={false} className="my-4" />
      <p>意味的に区切られた次のセクションの本文です。</p>
    </div>
  ),
};
