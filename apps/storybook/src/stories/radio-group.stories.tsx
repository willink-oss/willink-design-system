import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, RadioGroup, RadioGroupItem } from "@willink-labs/react";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="standard" aria-label="プランを選択">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="standard" id="plan-standard" />
        <Label htmlFor="plan-standard" size="sm">
          スタンダード
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="premium" id="plan-premium" />
        <Label htmlFor="plan-premium" size="sm">
          プレミアム
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="enterprise" id="plan-enterprise" />
        <Label htmlFor="plan-enterprise" size="sm">
          エンタープライズ
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup
      defaultValue="all"
      aria-label="通知の頻度"
      className="flex gap-6"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="all" id="notify-all" />
        <Label htmlFor="notify-all" size="sm">
          すべて
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="mention" id="notify-mention" />
        <Label htmlFor="notify-mention" size="sm">
          メンションのみ
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="none" id="notify-none" />
        <Label htmlFor="notify-none" size="sm">
          オフ
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <RadioGroup defaultValue="bank" aria-label="支払い方法">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="bank" id="pay-bank" />
        <Label htmlFor="pay-bank" size="sm">
          銀行振込
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="card" id="pay-card" />
        <Label htmlFor="pay-card" size="sm">
          クレジットカード
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="invoice" id="pay-invoice" disabled />
        <Label htmlFor="pay-invoice" size="sm" className="opacity-70">
          請求書払い（法人のみ）
        </Label>
      </div>
    </RadioGroup>
  ),
};
