'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@willink-labs/react';

/**
 * CommandPalette — a ⌘K modal command palette composing the @willink-labs/react
 * Command (cmdk fuzzy-search menu) inside a controlled Dialog. This is a
 * copy-to-own block: the groups, copy, and handlers are yours to edit, while
 * the primitives and `--color-brand` theming come from the npm packages — a
 * consumer's single `--color-brand` override re-themes it (ADR-0020).
 *
 * Open state is local useState, and a useEffect installs a window keydown
 * listener that toggles the palette on ⌘K / Ctrl+K (preventDefault'd), so this
 * is a client component. cmdk supplies the combobox/listbox semantics
 * (filtered items, arrow-key navigation, `aria-selected` highlight); the
 * surrounding Dialog supplies the focus trap and overlay. A visually-hidden
 * DialogTitle gives the modal its required accessible name, and the trigger
 * Button carries the ⌘K hint so the palette is reachable by pointer too.
 */

export type CommandPaletteGroup = {
  heading: string;
  items: { label: string; shortcut?: string }[];
};

const DEFAULT_GROUPS: CommandPaletteGroup[] = [
  {
    heading: 'ナビゲーション',
    items: [
      { label: 'ホーム', shortcut: '⌘H' },
      { label: 'プロジェクト', shortcut: '⌘P' },
      { label: '設定', shortcut: '⌘,' },
    ],
  },
  {
    heading: 'アクション',
    items: [
      { label: '新規作成', shortcut: '⌘N' },
      { label: '検索', shortcut: '⌘F' },
    ],
  },
];

export function CommandPalette({
  groups = DEFAULT_GROUPS,
  triggerLabel = 'コマンド',
  onSelect,
}: {
  groups?: CommandPaletteGroup[];
  /** Hint Button label; pass null to render the palette without a trigger. */
  triggerLabel?: string | null;
  /** Wire item selection to your own handlers; without it items just close the palette. */
  onSelect?: (item: { heading: string; label: string }) => void;
}) {
  const [open, setOpen] = useState(false);

  // ⌘K (macOS) / Ctrl+K (Windows・Linux) toggles the palette from anywhere.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function handleSelect(heading: string, label: string) {
    onSelect?.({ heading, label });
    setOpen(false);
  }

  return (
    <>
      {triggerLabel ? (
        <Button variant="outline" onClick={() => setOpen(true)}>
          <span>{triggerLabel}</span>
          <kbd
            aria-hidden="true"
            className="ml-1 rounded border border-border bg-surface-subtle px-1.5 text-xs text-muted"
          >
            ⌘K
          </kbd>
        </Button>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0">
          <DialogTitle className="sr-only">コマンドパレット</DialogTitle>
          <DialogDescription className="sr-only">
            コマンドを検索して実行します
          </DialogDescription>
          <Command>
            <CommandInput placeholder="コマンドや検索…" />
            <CommandList>
              <CommandEmpty>結果がありません</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.label}
                      value={item.label}
                      onSelect={() => handleSelect(group.heading, item.label)}
                    >
                      <span>{item.label}</span>
                      {item.shortcut ? (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
