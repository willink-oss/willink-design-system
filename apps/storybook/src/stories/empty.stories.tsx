import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Empty } from "@willink-labs/react";

const meta = {
  title: "Components/Empty",
  component: Empty,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Empty {...args}>
      <h3 className="text-fg text-base font-semibold">No projects yet</h3>
      <p className="text-muted">
        Create your first project to get started.
      </p>
      <Button className="mt-2">New project</Button>
    </Empty>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col divide-y divide-border">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Empty key={size} size={size}>
          <h3 className="text-fg font-semibold">No results ({size})</h3>
          <p className="text-muted">Try adjusting your filters.</p>
        </Empty>
      ))}
    </div>
  ),
};
