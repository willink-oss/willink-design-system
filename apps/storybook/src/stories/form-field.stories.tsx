import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FormField,
  FormFieldControl,
  FormFieldDescription,
  FormFieldError,
  FormFieldLabel,
  Input,
  Textarea,
} from "@willink-labs/react";

const meta = {
  title: "Components/FormField",
  component: FormField,
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormField {...args} className="w-[320px]">
      <FormFieldLabel size="sm">氏名</FormFieldLabel>
      <FormFieldControl>
        <Input placeholder="山田 太郎" />
      </FormFieldControl>
      <FormFieldDescription>姓と名の間にスペースを入れてください。</FormFieldDescription>
    </FormField>
  ),
};

export const Invalid: Story = {
  render: () => (
    <FormField className="w-[320px]">
      <FormFieldLabel size="sm">メールアドレス</FormFieldLabel>
      <FormFieldControl>
        <Input type="email" defaultValue="taro@example" />
      </FormFieldControl>
      <FormFieldDescription>会社のメールアドレスを入力してください。</FormFieldDescription>
      <FormFieldError>メールアドレスの形式が正しくありません。</FormFieldError>
    </FormField>
  ),
};

export const Required: Story = {
  render: () => (
    <FormField className="w-[320px]">
      <FormFieldLabel size="sm" required>
        社員番号
      </FormFieldLabel>
      <FormFieldControl>
        <Input placeholder="EMP-00123" />
      </FormFieldControl>
    </FormField>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <FormField className="w-[320px]">
      <FormFieldLabel size="sm">お問い合わせ内容</FormFieldLabel>
      <FormFieldControl>
        <Textarea rows={4} placeholder="どのようなご相談ですか?" />
      </FormFieldControl>
      <FormFieldDescription>500 文字以内でご記入ください。</FormFieldDescription>
    </FormField>
  ),
};
