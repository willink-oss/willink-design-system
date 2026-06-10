import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@willink-labs/react";

const meta = {
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="plan" size="sm">
        プラン
      </Label>
      <Select>
        <SelectTrigger id="plan">
          <SelectValue placeholder="プランを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">スタンダード</SelectItem>
          <SelectItem value="premium">プレミアム</SelectItem>
          <SelectItem value="enterprise">エンタープライズ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="timezone" size="sm">
        タイムゾーン
      </Label>
      <Select defaultValue="tokyo">
        <SelectTrigger id="timezone">
          <SelectValue placeholder="タイムゾーンを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>アジア</SelectLabel>
            <SelectItem value="tokyo">東京 (UTC+9)</SelectItem>
            <SelectItem value="singapore">シンガポール (UTC+8)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>ヨーロッパ</SelectLabel>
            <SelectItem value="london">ロンドン (UTC+0)</SelectItem>
            <SelectItem value="paris">パリ (UTC+1)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="role" size="sm">
        権限
      </Label>
      <Select>
        <SelectTrigger id="role">
          <SelectValue placeholder="権限を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">閲覧者</SelectItem>
          <SelectItem value="editor">編集者</SelectItem>
          <SelectItem value="owner" disabled>
            オーナー（変更不可）
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="region" size="sm">
        リージョン
      </Label>
      <Select disabled defaultValue="ap-northeast-1">
        <SelectTrigger id="region">
          <SelectValue placeholder="リージョンを選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ap-northeast-1">東京 (ap-northeast-1)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
