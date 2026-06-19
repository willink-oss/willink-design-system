import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../lib/cn";

/**
 * ButtonGroup — segmented container that visually joins Button children.
 *
 * Renders a `<div role="group">` with `inline-flex` and uses arbitrary child
 * selectors to connect outer corners and collapse the inner borders of its
 * Button children. Reuses the {@link Button} component as children — it does
 * not reimplement any button styles.
 *
 * - `horizontal` (default): row layout, left/right corners rounded, inner
 *   left margins collapsed (`-ml-px`).
 * - `vertical`: column layout, top/bottom corners rounded, inner top margins
 *   collapsed (`-mt-px`).
 *
 * @example
 *   <ButtonGroup>
 *     <Button variant="outline">Left</Button>
 *     <Button variant="outline">Middle</Button>
 *     <Button variant="outline">Right</Button>
 *   </ButtonGroup>
 */
const buttonGroupVariants = cva("isolate [&>button]:rounded-none", {
  variants: {
    orientation: {
      horizontal: [
        "inline-flex flex-row",
        "[&>button:first-child]:rounded-l-full",
        "[&>button:last-child]:rounded-r-full",
        "[&>button:not(:first-child)]:-ml-px",
      ],
      vertical: [
        "inline-flex flex-col",
        "[&>button:first-child]:rounded-t-full",
        "[&>button:last-child]:rounded-b-full",
        "[&>button:not(:first-child)]:-mt-px",
      ],
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof buttonGroupVariants>;

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  ),
);
ButtonGroup.displayName = "ButtonGroup";

export { buttonGroupVariants };
