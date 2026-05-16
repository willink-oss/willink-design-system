import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";

import { cn } from "../../lib/cn";

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
    "data-[state=on]:bg-brand data-[state=on]:text-brand-fg",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent text-fg hover:bg-neutral-100",
        outline:
          "border border-border bg-bg text-fg hover:bg-neutral-50 data-[state=on]:border-brand",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-full",
        md: "h-10 px-4 text-base rounded-full",
        lg: "h-12 px-6 text-base rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type ToggleProps = ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>;

export const Toggle = forwardRef<
  ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));
Toggle.displayName = "Toggle";

export { toggleVariants };
