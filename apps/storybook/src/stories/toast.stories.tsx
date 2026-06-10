import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Toaster, toast } from "@willink-labs/react";

const meta = {
  title: "Components/Toast",
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() => toast.success("プロフィールを保存しました")}
      >
        成功トーストを表示
      </Button>
      <Toaster />
    </>
  ),
};

export const Error: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.error("保存に失敗しました", {
            description: "時間をおいて再度お試しください。",
          })
        }
      >
        エラートーストを表示
      </Button>
      <Toaster />
    </>
  ),
};

export const PromiseToast: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: "アップロード中…",
              success: "アップロードが完了しました",
              error: "アップロードに失敗しました",
            },
          )
        }
      >
        非同期処理のトーストを表示
      </Button>
      <Toaster />
    </>
  ),
};
