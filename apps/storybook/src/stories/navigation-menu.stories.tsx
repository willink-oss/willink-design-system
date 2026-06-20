import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@willink-labs/react";

const meta = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>製品</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[320px] gap-1 p-2">
              <li>
                <NavigationMenuLink
                  href="/analytics"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-surface-subtle"
                >
                  アナリティクス
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="/billing"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-surface-subtle"
                >
                  請求管理
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>リソース</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[320px] gap-1 p-2">
              <li>
                <NavigationMenuLink
                  href="/docs"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-surface-subtle"
                >
                  ドキュメント
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  href="/blog"
                  className="block rounded-md px-3 py-2 text-sm hover:bg-surface-subtle"
                >
                  ブログ
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/pricing"
            className={navigationMenuTriggerStyle()}
          >
            料金
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
