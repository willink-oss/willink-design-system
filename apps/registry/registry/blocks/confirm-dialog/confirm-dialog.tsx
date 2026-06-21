'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@willink-labs/react';

/**
 * ConfirmDialog — a reusable confirmation dialog composing the
 * @willink-labs/react AlertDialog primitives (Trigger + Content + Header +
 * Title + Description + Footer + Cancel + Action) with a Button trigger.
 *
 * The underlying AlertDialog renders `role="alertdialog"` with a focus trap and
 * does NOT close on an overlay/outside click (Radix confirmation semantics) — the
 * user dismisses it via Cancel, the Action, or Escape. The dialog itself is uncontrolled
 * (Trigger-driven open state); the only wired surface is `onConfirm`, fired when
 * the Action button is pressed. When `destructive` is true (the default) the
 * Action button is styled with the `--color-danger` token for a clear
 * irreversible-action affordance.
 *
 * Copy-to-own via `npx shadcn add @willink/confirm-dialog` — the labels, copy,
 * and confirm handler are yours to edit, while the primitives and token theming
 * come from the npm packages (ADR-0020).
 */
export function ConfirmDialog({
  triggerLabel = '削除',
  title = '本当に実行しますか?',
  description = 'この操作は取り消せません。続行する前に内容をご確認ください。',
  confirmLabel = '削除する',
  cancelLabel = 'キャンセル',
  onConfirm,
  destructive = true,
}: {
  /** Text of the button that opens the dialog. */
  triggerLabel?: string;
  /** Dialog heading (announced as the alertdialog's accessible name). */
  title?: string;
  /** Supporting copy explaining the consequence of the action. */
  description?: string;
  /** Label of the confirming Action button. Defaults to 削除する. */
  confirmLabel?: string;
  /** Label of the dismissing Cancel button. Defaults to キャンセル. */
  cancelLabel?: string;
  /** Fired when the user presses the confirm Action button. */
  onConfirm?: () => void;
  /** When true (default), the confirm Action is styled as a destructive (danger) action. */
  destructive?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm?.()}
            className={
              destructive
                ? 'bg-danger text-white shadow-none hover:bg-danger/90 focus-visible:ring-danger'
                : undefined
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
