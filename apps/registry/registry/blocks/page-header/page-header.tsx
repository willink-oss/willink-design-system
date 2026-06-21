'use client';

import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@willink-labs/react';
import { Fragment } from 'react';

type PageHeaderAction = { label: string; onClick?: () => void };
type PageHeaderMenuAction = {
  label: string;
  onSelect?: () => void;
  variant?: 'default' | 'danger';
};

/**
 * PageHeader — an app/admin page header composing the @willink-labs/react
 * primitives (Breadcrumb + Badge + ButtonGroup + Button + DropdownMenu). A
 * breadcrumb trail sits above a title row: on the left an <h1> with an optional
 * status Badge, on the right an actions cluster — primary/secondary Buttons
 * grouped via ButtonGroup plus an overflow DropdownMenu for the rest.
 *
 * This is a copy-to-own block: the markup is yours to edit, while the primitives
 * and `--color-brand` theming come from the npm packages — a consumer's single
 * `--color-brand` override re-themes it (ADR-0020).
 *
 * Actions are handler-based (save / preview / duplicate / delete are commands,
 * not navigation): pass `onClick` / `onSelect` to wire them, so this is a client
 * component ('use client'). The overflow trigger carries an sr-only accessible
 * name and the ⋯ glyph is aria-hidden; the final breadcrumb renders as
 * BreadcrumbPage (aria-current="page") while the rest are BreadcrumbLinks.
 */
export function PageHeader({
  breadcrumbs = [
    { label: 'ダッシュボード', href: '#' },
    { label: 'プロジェクト', href: '#' },
    { label: 'Willink 移行計画' },
  ],
  title = 'Willink 移行計画',
  badge = '進行中',
  primaryAction = { label: '保存' },
  secondaryAction = { label: 'プレビュー' },
  menuActions = [
    { label: '複製' },
    { label: 'アーカイブ' },
    { label: '削除', variant: 'danger' },
  ],
}: {
  /** 階層ナビゲーション。最後の要素が現在ページ（リンクなし）として描画される。 */
  breadcrumbs?: { label: string; href?: string }[];
  title?: string;
  /** タイトル横のステータス Badge。null で非表示。 */
  badge?: string | null;
  /** 主アクション。`onClick` でハンドラを配線。null で主/副ボタン群を非表示。 */
  primaryAction?: PageHeaderAction | null;
  /** 副アクション。`onClick` でハンドラを配線。null で非表示。 */
  secondaryAction?: PageHeaderAction | null;
  /** オーバーフローメニュー項目。`onSelect` でハンドラを配線。空配列で非表示。 */
  menuActions?: PageHeaderMenuAction[];
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6">
      {breadcrumbs.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${index}`}>
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {isLast ? null : <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {title ? (
            <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
          ) : null}
          {badge ? <Badge variant="outline">{badge}</Badge> : null}
        </div>

        <div className="flex items-center gap-2">
          {primaryAction || secondaryAction ? (
            <ButtonGroup>
              {secondaryAction ? (
                <Button variant="outline" size="sm" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              ) : null}
              {primaryAction ? (
                <Button size="sm" onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </Button>
              ) : null}
            </ButtonGroup>
          ) : null}

          {menuActions.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                  <span aria-hidden="true">⋯</span>
                  <span className="sr-only">その他の操作</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {menuActions.map((action, index) => (
                  <DropdownMenuItem
                    key={`${action.label}-${index}`}
                    onSelect={() => action.onSelect?.()}
                    className={
                      action.variant === 'danger'
                        ? 'text-danger focus:text-danger'
                        : undefined
                    }
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
