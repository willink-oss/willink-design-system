import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@willink-labs/react";

const meta = {
  title: "Components/Slider",
  component: Slider,
  args: {
    "aria-label": "音量",
    defaultValue: [50],
    max: 100,
    step: 1,
    className: "w-80",
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Range: Story = {
  args: {
    "aria-label": "価格帯",
    defaultValue: [20, 80],
  },
};

export const Steps: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">明るさ</span>
        <span className="text-muted">25% 刻み</span>
      </div>
      <Slider aria-label="明るさ" defaultValue={[75]} max={100} step={25} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    "aria-label": "音量（無効）",
    disabled: true,
  },
};
