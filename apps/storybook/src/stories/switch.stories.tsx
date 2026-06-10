import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label, Switch } from "@willink-labs/react";

const meta = {
  title: "Components/Switch",
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} id="switch-notifications" />
      <Label htmlFor="switch-notifications">通知を受け取る</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch {...args} defaultChecked id="switch-airplane" />
      <Label htmlFor="switch-airplane">機内モード</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch disabled id="switch-disabled-off" />
        <Label htmlFor="switch-disabled-off">オフ（無効）</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch disabled defaultChecked id="switch-disabled-on" />
        <Label htmlFor="switch-disabled-on">オン（無効）</Label>
      </div>
    </div>
  ),
};
