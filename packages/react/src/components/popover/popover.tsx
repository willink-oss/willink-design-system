import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

import { cn } from "../../lib/cn";

/**
 * Popover — click-triggered floating panel on Radix.
 *
 * Unlike Tooltip (hover/focus, inverted bubble), Popover is a focusable panel
 * (border + surface + shadow) for rich content: menus of inputs, info cards,
 * date pickers, comboboxes. Radix manages focus, dismiss (Esc / outside click),
 * and positioning.
 *
 *   <Popover>
 *     <PopoverTrigger asChild><Button>Open</Button></PopoverTrigger>
 *     <PopoverContent aria-label="Settings">…</PopoverContent>
 *   </Popover>
 *
 * a11y: Radix gives the content `role="dialog"`, which REQUIRES an accessible
 * name — pass `aria-label` (or `aria-labelledby` pointing at a heading inside).
 * Without one, screen readers announce an unnamed dialog (axe `aria-dialog-name`).
 */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverPortal = PopoverPrimitive.Portal;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border border-border bg-bg p-4 text-fg shadow-md outline-none",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        "motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";
