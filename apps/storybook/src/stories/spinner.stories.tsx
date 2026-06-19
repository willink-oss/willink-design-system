import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@willink-labs/react";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="text-brand" />
      <Spinner className="text-fg" />
      <Spinner className="text-muted" />
      <Spinner className="text-danger" />
    </div>
  ),
};
