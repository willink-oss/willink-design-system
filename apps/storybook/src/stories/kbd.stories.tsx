import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "@willink-labs/react";

const meta = {
  title: "Components/Kbd",
  component: Kbd,
  args: {
    children: "Esc",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Kbd size="sm">Esc</Kbd>
      <Kbd size="md">Esc</Kbd>
    </div>
  ),
};

export const Combo: Story = {
  render: () => (
    <p className="flex items-center gap-1 text-sm text-fg">
      Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.
    </p>
  ),
};
