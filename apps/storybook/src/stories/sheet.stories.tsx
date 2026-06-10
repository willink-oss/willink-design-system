import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Input,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@willink-labs/react";

const meta = {
  title: "Components/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">シートを開く</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>プロフィールの編集</SheetTitle>
          <SheetDescription>
            変更内容は保存ボタンを押すまで反映されません。
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sheet-name" size="sm">
              氏名
            </Label>
            <Input id="sheet-name" defaultValue="山田 太郎" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sheet-email" size="sm">
              メールアドレス
            </Label>
            <Input
              id="sheet-email"
              type="email"
              defaultValue="taro@example.com"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </SheetClose>
          <Button>保存する</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftNavigation: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">メニュー</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>ナビゲーション</SheetTitle>
          <SheetDescription>移動先を選択してください。</SheetDescription>
        </SheetHeader>
        <nav aria-label="メイン" className="grid gap-2 py-4 text-sm">
          <a className="rounded-md px-2 py-1.5 hover:bg-neutral-100" href="#">
            ダッシュボード
          </a>
          <a className="rounded-md px-2 py-1.5 hover:bg-neutral-100" href="#">
            プロジェクト
          </a>
          <a className="rounded-md px-2 py-1.5 hover:bg-neutral-100" href="#">
            設定
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  ),
};

export const BottomActionSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">操作を選択</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>ファイルの操作</SheetTitle>
          <SheetDescription>
            実行する操作を選択してください。
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="pt-4">
          <SheetClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </SheetClose>
          <Button variant="outline">複製する</Button>
          <Button>共有する</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>side=&quot;{side}&quot;</SheetTitle>
              <SheetDescription>
                {side} からスライドインするシートです。
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
