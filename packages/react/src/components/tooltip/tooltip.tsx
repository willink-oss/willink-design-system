import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

import { cn } from "../../lib/cn";

/**
 * TooltipProvider — wrap your app (or a section) so all child Tooltips
 * share delay / skip behavior. Required by Radix.
 *
 * Default `delayDuration` = 300ms (Radix default 700ms is sluggish for
 * small icon-buttons・DS choice for snappier feel).
 *
 * Provider is a context-only component (no DOM element), hence no `ref` forwarding.
 */
export const TooltipProvider = ({
  delayDuration = 300,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
);
TooltipProvider.displayName = "TooltipProvider";

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipPortal = TooltipPrimitive.Portal;

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-surface-inverted px-3 py-1.5 text-xs text-surface-inverted-fg shadow-md",
        "data-[state=delayed-open]:animate-fade-in data-[state=closed]:animate-fade-out",
        "motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";
