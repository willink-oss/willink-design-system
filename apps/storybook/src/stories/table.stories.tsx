import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@willink-labs/react";

const meta = {
  title: "Components/Table",
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  { id: "INV-001", plan: "Pro", users: 128, amount: "¥153,600", status: "支払済" },
  { id: "INV-002", plan: "Business", users: 42, amount: "¥84,000", status: "未払い" },
  { id: "INV-003", plan: "Starter", users: 8, amount: "¥9,600", status: "支払済" },
];

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>2026年5月の請求一覧</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>請求番号</TableHead>
          <TableHead>プラン</TableHead>
          <TableHead>ユーザー数</TableHead>
          <TableHead>金額</TableHead>
          <TableHead>ステータス</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.id}</TableCell>
            <TableCell>{row.plan}</TableCell>
            <TableCell>{row.users}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>
              <Badge variant={row.status === "支払済" ? "default" : "outline"}>
                {row.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithoutCaption: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>名前</TableHead>
          <TableHead>役割</TableHead>
          <TableHead>最終ログイン</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>白井 裕太朗</TableCell>
          <TableCell>管理者</TableCell>
          <TableCell>2026-06-14</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>山田 花子</TableCell>
          <TableCell>編集者</TableCell>
          <TableCell>2026-06-12</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
