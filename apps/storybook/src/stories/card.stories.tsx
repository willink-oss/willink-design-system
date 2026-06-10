import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@willink-labs/react";

const meta = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-96">
      <CardHeader>
        <CardTitle>プランのアップグレード</CardTitle>
        <CardDescription>
          チーム全員でご利用いただけるプランです。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          月額 ¥1,200 / ユーザーで、無制限のプロジェクトと優先サポートが含まれます。
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">あとで</Button>
        <Button>アップグレード</Button>
      </CardFooter>
    </Card>
  ),
};

export const Elevated: Story = {
  args: { variant: "elevated" },
  render: (args) => (
    <Card {...args} className="w-96">
      <CardHeader>
        <CardTitle>月次レポート</CardTitle>
        <CardDescription>2026年5月の利用状況サマリー</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">アクティブユーザー数は前月比 12% 増加しました。</p>
      </CardContent>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args} className="w-96">
      <CardContent className="pt-6">
        <p className="text-sm">
          ヘッダーやフッターを省略して、コンテンツだけのシンプルな構成にもできます。
        </p>
      </CardContent>
    </Card>
  ),
};
