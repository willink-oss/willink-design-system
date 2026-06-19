import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup, ToggleGroupItem } from "@willink-labs/react";
import { Bold, Italic, Underline } from "lucide-react";

const meta = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["single", "multiple"],
    },
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: "single" },
  render: (args) => (
    <ToggleGroup {...args} aria-label="文字書式">
      <ToggleGroupItem value="bold" aria-label="太字">
        <Bold aria-hidden className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="斜体">
        <Italic aria-hidden className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="下線">
        <Underline aria-hidden className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  args: { type: "multiple" },
  render: (args) => (
    <ToggleGroup {...args} aria-label="文字書式">
      <ToggleGroupItem value="bold" aria-label="太字">
        <Bold aria-hidden className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="斜体">
        <Italic aria-hidden className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="下線">
        <Underline aria-hidden className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  args: { type: "single", variant: "outline" },
  render: (args) => (
    <ToggleGroup {...args} aria-label="配置">
      <ToggleGroupItem value="left">左</ToggleGroupItem>
      <ToggleGroupItem value="center">中央</ToggleGroupItem>
      <ToggleGroupItem value="right">右</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ToggleGroup type="single" size="sm" aria-label="サイズ sm">
        <ToggleGroupItem value="a">Small A</ToggleGroupItem>
        <ToggleGroupItem value="b">Small B</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="md" aria-label="サイズ md">
        <ToggleGroupItem value="a">Medium A</ToggleGroupItem>
        <ToggleGroupItem value="b">Medium B</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="lg" aria-label="サイズ lg">
        <ToggleGroupItem value="a">Large A</ToggleGroupItem>
        <ToggleGroupItem value="b">Large B</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
