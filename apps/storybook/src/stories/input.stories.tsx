import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Label } from "@willink-labs/react";

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    placeholder: "山田 太郎",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="input-default" size="sm">
        氏名
      </Label>
      <Input id="input-default" {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="input-invalid" size="sm">
        メールアドレス
      </Label>
      <Input
        id="input-invalid"
        type="email"
        defaultValue="taro@example"
        aria-invalid
        aria-describedby="input-invalid-message"
      />
      <p id="input-invalid-message" className="text-sm text-danger">
        メールアドレスの形式が正しくありません。
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="input-disabled" size="sm">
        社員番号
      </Label>
      <Input id="input-disabled" defaultValue="EMP-00123" disabled />
    </div>
  ),
};
