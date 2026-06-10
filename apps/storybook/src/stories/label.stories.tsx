import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Label } from "@willink-labs/react";

const meta = {
  title: "Components/Label",
  component: Label,
  args: {
    children: "メールアドレス",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid w-[320px] gap-2">
      <Label {...args} htmlFor="label-default" />
      <Input id="label-default" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const Required: Story = {
  args: { required: true },
  render: (args) => (
    <div className="grid w-[320px] gap-2">
      <Label {...args} htmlFor="label-required" />
      <Input id="label-required" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid w-[320px] gap-6">
      <div className="grid gap-2">
        <Label htmlFor="label-size-sm" size="sm">
          小さいラベル（sm）
        </Label>
        <Input id="label-size-sm" placeholder="sm" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="label-size-md" size="md">
          標準ラベル（md）
        </Label>
        <Input id="label-size-md" placeholder="md" />
      </div>
    </div>
  ),
};
