import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "@willink-labs/react";

const meta = {
  title: "Components/Progress",
  component: Progress,
  args: {
    value: 40,
    "aria-label": "アップロードの進捗",
    className: "w-[320px]",
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = {
  args: { value: 100 },
};

export const Indeterminate: Story = {
  render: () => (
    <Progress aria-label="読み込み中" className="w-[320px]" />
  ),
};

export const WithValueLabel: Story = {
  render: () => (
    <div className="grid w-[320px] gap-2">
      <div className="flex items-center justify-between text-sm">
        <span id="progress-upload-label">ファイルをアップロード中</span>
        <span aria-hidden>65%</span>
      </div>
      <Progress value={65} aria-labelledby="progress-upload-label" />
    </div>
  ),
};
