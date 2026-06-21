'use client';

import { useState, type ReactNode } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@willink-labs/react';

/**
 * DashboardShell — a responsive app shell composing the @willink-labs/react
 * primitives (Sheet + ScrollArea + Avatar + DropdownMenu + Button + Badge +
 * Separator). A fixed left sidebar (brand + scrollable <nav> rail) shows on
 * desktop and collapses on mobile into a Sheet drawer opened from a topbar
 * hamburger; the topbar also carries the page title and a user DropdownMenu.
 * Arbitrary page content renders in the main area as {children}.
 *
 * This is a copy-to-own block: the markup is yours to edit, while the primitives
 * and `--color-brand` theming come from the npm packages — a consumer's single
 * `--color-brand` override re-themes it (ADR-0020).
 *
 * The mobile drawer's open state is local useState (so it closes on nav-link
 * tap), making this a client component ('use client'). Nav links navigate via
 * `href` (rendered as an <a> through Button `asChild`), the active link gets
 * `aria-current="page"` plus a filled variant, and user-menu items are wired
 * through `onSelect`. a11y: the rail is a <nav aria-label> landmark, the mobile
 * hamburger and user-menu triggers carry accessible names, decorative glyphs are
 * aria-hidden, and the Sheet gets an sr-only SheetTitle for its required name.
 */

export type DashboardNavItem = {
  label: string;
  /** Navigation target; rendered as an <a> via Button `asChild`. */
  href?: string;
  /** Highlights the link and sets aria-current="page". */
  active?: boolean;
  /** Optional trailing count Badge (e.g. unread / pending). */
  badge?: string;
};

export type DashboardUser = {
  name: string;
  email?: string;
  avatarSrc?: string;
  /** Initials shown while the avatar image loads or is absent. */
  avatarFallback?: string;
};

export type DashboardUserMenuItem = {
  label: string;
  onSelect?: () => void;
};

const DEFAULT_NAV: DashboardNavItem[] = [
  { label: 'ダッシュボード', href: '#', active: true },
  { label: 'プロジェクト', href: '#' },
  { label: 'タスク', href: '#', badge: '8' },
  { label: 'メンバー', href: '#' },
  { label: 'レポート', href: '#' },
  { label: '設定', href: '#' },
];

const DEFAULT_USER: DashboardUser = {
  name: '佐藤 健',
  email: 'sato.takeru@example.co.jp',
  avatarFallback: '佐',
};

const DEFAULT_USER_MENU: DashboardUserMenuItem[] = [
  { label: 'プロフィール' },
  { label: 'アカウント設定' },
  { label: 'ログアウト' },
];

/** The scrollable nav rail, reused by the desktop sidebar and the mobile Sheet. */
function SidebarNav({
  navItems,
  onNavigate,
}: {
  navItems: DashboardNavItem[];
  /** Called after a link is chosen — lets the mobile drawer close itself. */
  onNavigate?: () => void;
}) {
  return (
    <ScrollArea className="flex-1">
      <nav aria-label="メインナビゲーション" className="flex flex-col gap-1 p-3">
        {navItems.map((item, index) => (
          <Button
            key={`${item.label}-${index}`}
            asChild
            variant={item.active ? 'outline' : 'ghost'}
            size="sm"
            className="h-10 w-full justify-start rounded-md px-3"
          >
            <a
              href={item.href ?? '#'}
              aria-current={item.active ? 'page' : undefined}
              onClick={onNavigate}
            >
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge ? (
                <Badge variant={item.active ? 'default' : 'outline'}>
                  {item.badge}
                </Badge>
              ) : null}
            </a>
          </Button>
        ))}
      </nav>
    </ScrollArea>
  );
}

export function DashboardShell({
  children,
  navItems = DEFAULT_NAV,
  title = 'ダッシュボード',
  user = DEFAULT_USER,
  userMenu = DEFAULT_USER_MENU,
}: {
  /** The page content rendered in the main area. */
  children?: ReactNode;
  navItems?: DashboardNavItem[];
  /** Topbar heading for the current page. */
  title?: string;
  user?: DashboardUser;
  /** User dropdown items; wire each via `onSelect`. */
  userMenu?: DashboardUserMenuItem[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const brand = (
    <a
      href="#"
      className="flex h-16 shrink-0 items-center gap-2 px-5 text-lg font-bold tracking-tight text-fg"
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-sm font-bold text-brand-fg"
      >
        W
      </span>
      <span>Willink</span>
    </a>
  );

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      {/* Desktop sidebar — hidden on mobile, opened as a Sheet there instead. */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface-subtle md:flex">
        {brand}
        <Separator />
        <SidebarNav navItems={navItems} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-bg px-4">
          {/* Mobile drawer: same nav rail inside a left-side Sheet. */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 px-0 md:hidden"
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  ☰
                </span>
                <span className="sr-only">メニューを開く</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col p-0">
              <SheetTitle className="sr-only">メインメニュー</SheetTitle>
              {brand}
              <Separator />
              <SidebarNav
                navItems={navItems}
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <h1 className="flex-1 truncate text-base font-semibold text-fg">
            {title}
          </h1>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 gap-2 px-1.5"
              >
                <Avatar className="h-8 w-8">
                  {user.avatarSrc ? (
                    <AvatarImage src={user.avatarSrc} alt="" />
                  ) : null}
                  <AvatarFallback>
                    {user.avatarFallback ?? user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                  {user.name}
                </span>
                <span className="sr-only">ユーザーメニューを開く</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
              <DropdownMenuLabel>
                <span className="block truncate font-semibold">{user.name}</span>
                {user.email ? (
                  <span className="block truncate text-xs font-normal text-muted">
                    {user.email}
                  </span>
                ) : null}
              </DropdownMenuLabel>
              {userMenu.length > 0 ? <DropdownMenuSeparator /> : null}
              {userMenu.map((item, index) => (
                <DropdownMenuItem
                  key={`${item.label}-${index}`}
                  onSelect={() => item.onSelect?.()}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="min-w-0 flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
