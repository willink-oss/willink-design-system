import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../lib/cn";

/**
 * Empty — presentational empty-state container.
 *
 * Centered column for "no data / nothing here yet" surfaces. Consumers compose
 * the contents (icon, title, description, an action `Button`) as children — this
 * primitive only owns layout + muted typography, not structure.
 *
 * Non-interactive: no `role` is applied. `size` controls vertical padding +
 * max width (`sm` / `md` / `lg`, default `md`).
 *
 * @example
 *   <Empty>
 *     <h3 className="text-fg font-semibold">No projects yet</h3>
 *     <p>Create your first project to get started.</p>
 *     <Button className="mt-2">New project</Button>
 *   </Empty>
 */
const emptyVariants = cva(
  [
    "flex flex-col items-center justify-center gap-2 text-center",
    "mx-auto text-fg-secondary",
  ],
  {
    variants: {
      size: {
        sm: "py-8 max-w-xs text-sm",
        md: "py-12 max-w-sm text-sm",
        lg: "py-16 max-w-md text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type EmptyProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof emptyVariants>;

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty"
      className={cn(emptyVariants({ size }), className)}
      {...props}
    />
  ),
);
Empty.displayName = "Empty";

export { emptyVariants };
