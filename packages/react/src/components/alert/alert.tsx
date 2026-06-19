import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../../lib/cn";

/**
 * Alert — inline status banner (assertive `role="alert"` by default).
 *
 * Distinct from AlertDialog (modal confirmation) and Toast (transient).
 * Renders a static `<div>` that lives in the document flow and announces its
 * contents to assistive tech. Consumers pass the title/description as children.
 *
 * - `variant`: info (default・brand soft) / success / warning / danger — each
 *   maps to a semantic color token pair so it flips correctly in dark mode.
 * - `role`: defaults to `"alert"` (assertive). Override to `"status"` for
 *   non-urgent, polite announcements.
 *
 * @example
 *   <Alert>Your changes were saved.</Alert>
 *   <Alert variant="danger">Something went wrong.</Alert>
 *   <Alert variant="success" role="status">Profile updated.</Alert>
 */
const alertVariants = cva(
  ["rounded-lg border p-4 text-sm flex gap-3"],
  {
    variants: {
      variant: {
        info: "bg-brand-soft text-brand-soft-fg border-brand-soft",
        success: "bg-success/10 text-success border-success/30",
        warning: "bg-warning/10 text-warning border-warning/30",
        danger: "bg-danger/10 text-danger border-danger/30",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, role = "alert", ...props }, ref) => (
    <div
      ref={ref}
      role={role}
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

export { alertVariants };
