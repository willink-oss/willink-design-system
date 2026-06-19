import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../lib/cn";

/**
 * Kbd — inline keyboard-key hint.
 *
 * Renders a `<kbd>` element styled as a single key cap: `font-mono`,
 * a subtle `border-border` outline over `bg-surface-subtle`, rounded
 * corners and small `text-fg` text. Presentational / non-interactive.
 *
 * - `sm` (default): `text-xs` + tight padding (inline within body copy)
 * - `md`: `text-sm` + slightly larger padding
 *
 * @example
 *   Press <Kbd>Esc</Kbd> to close.
 *   <Kbd size="md">⌘</Kbd> <Kbd size="md">K</Kbd>
 */
const kbdVariants = cva(
  [
    "inline-flex items-center justify-center font-mono font-medium",
    "rounded border border-border bg-surface-subtle text-fg",
    "whitespace-nowrap align-middle",
  ],
  {
    variants: {
      size: {
        sm: "min-w-[1.25rem] px-1.5 py-0.5 text-xs",
        md: "min-w-[1.5rem] px-2 py-0.5 text-sm",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

export type KbdProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof kbdVariants>;

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, size, ...props }, ref) => (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={cn(kbdVariants({ size }), className)}
      {...props}
    />
  ),
);
Kbd.displayName = "Kbd";

export { kbdVariants };
