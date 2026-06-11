import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@willink-labs/react";
import { ArrowRight } from "lucide-react";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "ボタン",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Link: Story = {
  args: { variant: "link" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        次へ進む
        <ArrowRight aria-hidden className="size-4" />
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// Locks the toolbar theme global for this story (data-theme="dark", ADR-0013)
// so the dark rendering is always one click away in the sidebar — every other
// story is reviewable in dark via the toolbar Theme toggle instead.
export const DarkForced: Story = {
  globals: { theme: "dark" },
  render: (args) => (
    <div className="flex items-center gap-4">
      <Button {...args}>Default</Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
};
