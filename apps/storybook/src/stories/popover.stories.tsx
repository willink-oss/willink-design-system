import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@willink-labs/react";

const meta = {
  title: "Components/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">ポップオーバーを開く</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="お知らせ">
        <p className="text-sm text-fg">
          クリックで開く浮遊パネル。Esc / 外側クリックで閉じます。
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">サイズを設定</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="寸法の設定">
        <div className="grid gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-fg">寸法</h4>
            <p className="text-xs text-muted">幅と高さを指定します。</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="width">幅</Label>
              <Input id="width" defaultValue="320px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="height">高さ</Label>
              <Input id="height" defaultValue="240px" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
