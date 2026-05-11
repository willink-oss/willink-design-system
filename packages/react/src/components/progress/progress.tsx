import * as ProgressPrimitive from "@radix-ui/react-progress";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";

import { cn } from "../../lib/cn";

/**
 * Progress — determinate progress bar。Radix Progress wrapper。
 *
 * `value` を渡さない (undefined) と indeterminate (Radix 仕様)。
 *
 * @example
 *   <Progress value={65} max={100} />
 *   <Progress value={progress} aria-label="Upload progress" />
 */
export const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={value}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-neutral-200",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-brand transition-transform"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = "Progress";
