import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";

import { cn } from "../../lib/cn";

const labelVariants = cva(
  [
    "text-fg font-medium leading-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  ],
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    /** When true, renders a danger-colored asterisk after the label text. */
    required?: boolean;
  };

export const Label = forwardRef<ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, size, required, children, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ size }), className)}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  ),
);
Label.displayName = "Label";

export { labelVariants };
