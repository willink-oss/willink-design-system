import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Label } from "@willink-labs/react";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" size="sm">
        利用規約に同意します
      </Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="newsletter" defaultChecked />
      <Label htmlFor="newsletter" size="sm">
        ニュースレターを受け取る
      </Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked" size="sm">
          選択できない項目
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked" size="sm">
          固定で有効な項目
        </Label>
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start gap-2">
      <Checkbox id="marketing" aria-describedby="marketing-description" />
      <div className="grid gap-1.5">
        <Label htmlFor="marketing" size="sm">
          マーケティングメールを受け取る
        </Label>
        <p id="marketing-description" className="text-sm text-muted">
          新機能やキャンペーンのお知らせを月1回程度お送りします。
        </p>
      </div>
    </div>
  ),
};
