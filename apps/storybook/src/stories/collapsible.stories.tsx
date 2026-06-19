import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@willink-labs/react";

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-72 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-fg">
          @i-willink starred 3 repositories
        </span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            Toggle
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border border-border px-4 py-2 text-sm text-fg">
        @willink-labs/react
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border border-border px-4 py-2 text-sm text-fg">
          @willink-labs/preset-tailwind
        </div>
        <div className="rounded-md border border-border px-4 py-2 text-sm text-fg">
          @willink-labs/tokens
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
