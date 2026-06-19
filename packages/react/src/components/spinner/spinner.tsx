import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../lib/cn";

/**
 * Spinner — Loading indicator。
 *
 * 回転するリング（`border` + `animate-spin`）で読み込み中を表現する。
 * `motion-reduce:animate-none` で `prefers-reduced-motion` を尊重（ADR-0008）。
 *
 * リング自体は装飾。`role="status"` + `aria-label`（既定 `"読み込み中"`、props で上書き可）が
 * 意味を担うため、スクリーンリーダーにアクセシブルネームが伝わる。色は `text-*` から継承（既定 `text-brand`）。
 *
 * @example
 *   <Spinner />
 *   <Spinner size="lg" />
 *   <Spinner aria-label="Loading…" className="text-fg" />
 */
const spinnerVariants = cva(
  [
    "inline-block rounded-full border-current border-t-transparent",
    "animate-spin motion-reduce:animate-none",
    "text-brand",
  ],
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-6 border-2",
        lg: "size-8 border-[3px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof spinnerVariants>;

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, "aria-label": ariaLabel = "読み込み中", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label={ariaLabel}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";

export { spinnerVariants };
