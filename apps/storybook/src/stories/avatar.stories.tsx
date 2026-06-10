import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback, AvatarImage } from "@willink-labs/react";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://avatars.githubusercontent.com/u/124599?v=4&s=80"
        alt="白井 優太郎"
      />
      <AvatarFallback>白井</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/broken-image.png" alt="田中 花子" />
      <AvatarFallback>田中</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">小</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>中</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarFallback className="text-base">大</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-3">
      {["佐藤", "鈴木", "高橋"].map((name) => (
        <Avatar key={name} className="ring-2 ring-bg">
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
      ))}
      <Avatar className="ring-2 ring-bg">
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};
