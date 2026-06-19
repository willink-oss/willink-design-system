import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@willink-labs/react";

const meta = {
  title: "Components/HoverCard",
  component: HoverCard,
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@i-willink</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/i-willink.png" alt="i-Willink" />
            <AvatarFallback>iW</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-fg">i-Willink</h4>
            <p className="text-sm text-muted">
              デザインシステムとプロダクトエンジニアリング。
            </p>
            <p className="text-xs text-fg-secondary">2024 年から参加</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
