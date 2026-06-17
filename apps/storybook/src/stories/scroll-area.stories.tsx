import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "@willink-labs/react";

const meta = {
  title: "Components/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border border-border p-4">
      <div className="space-y-2">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="text-sm text-fg">
            タグ #{i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-72 rounded-md border border-border p-4">
      <div className="flex gap-3">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-surface-subtle text-sm text-fg"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
