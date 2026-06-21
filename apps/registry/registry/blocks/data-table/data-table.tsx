'use client';

import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Empty,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@willink-labs/react';
import type { BadgeProps } from '@willink-labs/react';

/**
 * DataTable — the flagship admin data table, composing the @willink-labs/react
 * Table + Checkbox (row + select-all) + Badge (status) + DropdownMenu (row
 * actions) + Pagination + Empty primitives. This is a copy-to-own block: the
 * markup and behaviour are yours to edit, while the primitives and
 * `--color-brand` theming come from the npm packages — a consumer's single
 * `--color-brand` override re-themes it (ADR-0020).
 *
 * Selection (which rows are checked + select-all) and the current page are
 * local useState, so this is a client component. Pagination is real: rows are
 * sliced by `pageSize`. When there are no rows, an <Empty> state renders in
 * place of the table. Checkboxes carry aria-labels and each row's actions
 * trigger has sr-only text, so the whole grid is keyboard- and SR-navigable.
 */

export type DataTableRow = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'invited' | 'suspended';
};

const STATUS: Record<
  DataTableRow['status'],
  { label: string; variant: BadgeProps['variant'] }
> = {
  active: { label: '有効', variant: 'success' },
  invited: { label: '招待中', variant: 'outline' },
  suspended: { label: '停止中', variant: 'danger' },
};

const DEFAULT_ROWS: DataTableRow[] = [
  { id: '1', name: '佐藤 健', email: 'sato.takeru@example.co.jp', status: 'active' },
  { id: '2', name: '鈴木 美咲', email: 'suzuki.misaki@example.co.jp', status: 'invited' },
  { id: '3', name: '高橋 大輔', email: 'takahashi.daisuke@example.co.jp', status: 'active' },
  { id: '4', name: '田中 由美', email: 'tanaka.yumi@example.co.jp', status: 'suspended' },
  { id: '5', name: '渡辺 翔太', email: 'watanabe.shota@example.co.jp', status: 'active' },
];

export function DataTable({
  rows = DEFAULT_ROWS,
  pageSize = 5,
  onAction,
}: {
  rows?: DataTableRow[];
  pageSize?: number;
  /** Wire row actions to your own handlers; without it the menu items are inert. */
  onAction?: (action: 'view' | 'edit' | 'delete', row: DataTableRow) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = useMemo(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [rows, currentPage, pageSize],
  );

  // Select-all reflects only the rows visible on the current page, as a tri-state:
  // all → checked, some → indeterminate (aria-checked="mixed"), none → unchecked.
  const pageIds = pageRows.map((r) => r.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someOnPageSelected = pageIds.some((id) => selected.has(id));
  const headerChecked: boolean | 'indeterminate' = allOnPageSelected
    ? true
    : someOnPageSelected
      ? 'indeterminate'
      : false;

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllOnPage(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of pageIds) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  if (rows.length === 0) {
    return (
      <Empty>
        <h3 className="font-semibold text-fg">ユーザーがいません</h3>
        <p>最初のメンバーを招待すると、ここに一覧が表示されます。</p>
        <Button className="mt-2">メンバーを招待</Button>
      </Empty>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(checked) => toggleAllOnPage(checked === true)}
                aria-label="このページのすべての行を選択"
              />
            </TableHead>
            <TableHead>名前</TableHead>
            <TableHead>メールアドレス</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">操作</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.map((row) => {
            const status = STATUS[row.status];
            const isSelected = selected.has(row.id);
            return (
              <TableRow
                key={row.id}
                data-state={isSelected ? 'selected' : undefined}
                className={isSelected ? 'bg-surface-muted' : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => toggleRow(row.id, checked === true)}
                    aria-label={`${row.name} を選択`}
                  />
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-muted">{row.email}</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                        <span aria-hidden="true">⋯</span>
                        <span className="sr-only">{row.name} の操作</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onAction?.('view', row)}>
                        詳細
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onAction?.('edit', row)}>
                        編集
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-danger focus:text-danger"
                        onSelect={() => onAction?.('delete', row)}
                      >
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted" aria-live="polite">
          {selected.size} 件選択中 / 全 {rows.length} 件
        </p>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? 'pointer-events-none opacity-50' : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage === pageCount}
                className={
                  currentPage === pageCount
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(pageCount, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
