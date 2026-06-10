import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Textarea } from "@willink-labs/react";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    placeholder: "ご意見・ご要望をご記入ください",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid w-[360px] gap-2">
      <Label htmlFor="textarea-message">メッセージ</Label>
      <Textarea {...args} id="textarea-message" rows={4} />
    </div>
  ),
};

export const Required: Story = {
  render: (args) => (
    <div className="grid w-[360px] gap-2">
      <Label htmlFor="textarea-feedback" required>
        フィードバック
      </Label>
      <Textarea {...args} id="textarea-feedback" rows={4} required />
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <div className="grid w-[360px] gap-2">
      <Label htmlFor="textarea-invalid">自己紹介</Label>
      <Textarea
        {...args}
        id="textarea-invalid"
        rows={4}
        aria-invalid
        aria-describedby="textarea-invalid-error"
        defaultValue="文字数が上限を超えています…"
      />
      <p id="textarea-invalid-error" className="text-sm text-danger">
        500文字以内で入力してください。
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="grid w-[360px] gap-2">
      <Label htmlFor="textarea-disabled">備考（編集不可）</Label>
      <Textarea
        {...args}
        id="textarea-disabled"
        rows={3}
        disabled
        defaultValue="この項目は管理者のみ編集できます。"
      />
    </div>
  ),
};
