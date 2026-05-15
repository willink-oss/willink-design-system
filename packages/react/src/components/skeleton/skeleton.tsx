import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../lib/cn";

/**
 * Skeleton — Loading placeholder。
 *
 * - `rect` (default): rounded-md + animate-pulse + bg-neutral-200 (汎用ブロック)
 * - `circle`: rounded-full (avatar 用 — h/w は className で指定)
 * - `text`: h-4 + rounded (テキスト行用)
 *
 * @example
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton variant="circle" className="h-10 w-10" />
 *   <Skeleton variant="text" className="w-48" />
 */
const skeletonVariants = cva("animate-pulse bg-neutral-200", {
  variants: {
    variant: {
      rect: "rounded-md",
      circle: "rounded-full",
      text: "h-4 rounded",
    },
  },
  defaultVariants: {
    variant: "rect",
  },
});

export type SkeletonProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonVariants>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export { skeletonVariants };
