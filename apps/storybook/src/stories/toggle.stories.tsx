import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "@willink-labs/react";
import { Bold } from "lucide-react";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  args: {
    children: "ピン留め",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Toggle {...args} size="sm">
        Small
      </Toggle>
      <Toggle {...args} size="md">
        Medium
      </Toggle>
      <Toggle {...args} size="lg">
        Large
      </Toggle>
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    "aria-label": "太字にする",
    children: <Bold aria-hidden className="size-4" />,
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
