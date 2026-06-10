import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@willink-labs/react";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="activity">アクティビティ</TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4 text-sm">
        プロジェクトの概要がここに表示されます。
      </TabsContent>
      <TabsContent value="activity" className="p-4 text-sm">
        最近のアクティビティの一覧です。
      </TabsContent>
      <TabsContent value="settings" className="p-4 text-sm">
        プロジェクト設定を編集します。
      </TabsContent>
    </Tabs>
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="login" className="w-[360px]">
      <TabsList>
        <TabsTrigger value="login">ログイン</TabsTrigger>
        <TabsTrigger value="signup">新規登録</TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="p-4 text-sm">
        ログインフォーム
      </TabsContent>
      <TabsContent value="signup" className="p-4 text-sm">
        新規登録フォーム
      </TabsContent>
    </Tabs>
  ),
};
