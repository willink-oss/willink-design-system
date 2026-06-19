import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "@willink-labs/react";

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    children: "Your changes were saved successfully.",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert variant="info">This is an informational message.</Alert>
      <Alert variant="success">Your profile was updated.</Alert>
      <Alert variant="warning">Your session will expire soon.</Alert>
      <Alert variant="danger">Something went wrong. Please try again.</Alert>
    </div>
  ),
};
