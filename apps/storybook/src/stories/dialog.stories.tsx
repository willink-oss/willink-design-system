import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@willink-labs/react";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロフィールの編集</DialogTitle>
          <DialogDescription>
            変更内容は保存ボタンを押すまで反映されません。
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm">フォームの内容がここに入ります。</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">キャンセル</Button>
          </DialogClose>
          <Button>保存する</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
