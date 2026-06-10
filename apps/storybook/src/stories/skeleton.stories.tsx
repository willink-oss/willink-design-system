import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "@willink-labs/react";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  args: {
    className: "h-4 w-48",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["rect", "circle", "text"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Skeleton className="h-16 w-24" />
      <Skeleton variant="circle" className="h-12 w-12" />
      <Skeleton variant="text" className="w-40" />
    </div>
  ),
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex w-80 items-start gap-4 rounded-md border border-border p-4">
      <Skeleton variant="circle" className="h-10 w-10 shrink-0" />
      <div className="w-full space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton className="mt-3 h-24 w-full" />
      </div>
    </div>
  ),
};
