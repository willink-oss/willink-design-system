import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-brand text-brand-fg shadow-lg shadow-brand-glow/20 hover:shadow-brand-glow/40 hover:bg-brand-hover",
        outline: "border border-border bg-bg text-fg hover:bg-surface-subtle",
        ghost: "text-fg hover:bg-surface-muted",
        link: "text-brand-soft-fg underline-offset-4 hover:underline hover:text-brand-hover shadow-none h-auto px-1",
      },
      size: {
        sm: "h-8 px-4 text-sm rounded-full",
        md: "h-10 px-6 text-base rounded-full",
        lg: "h-14 px-8 text-base rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
