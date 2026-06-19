import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

import { cn } from "../../lib/cn";

/**
 * HoverCard — floating panel revealed on hover/focus of a trigger (Radix).
 *
 * Unlike Popover (click-triggered, focusable `role="dialog"` for rich input),
 * HoverCard is a sighted-hover affordance: a peek of secondary context (user
 * preview card, link metadata, glossary blurb) shown when a pointer rests on —
 * or keyboard focus reaches — the trigger. Radix manages open delay and
 * positioning.
 *
 *   <HoverCard>
 *     <HoverCardTrigger asChild><a href="…">@willink</a></HoverCardTrigger>
 *     <HoverCardContent>…</HoverCardContent>
 *   </HoverCard>
 *
 * a11y: Radix does NOT give the content `role="dialog"` (it is a hover preview,
 * not a focus-trapping surface), so no accessible name is required on the panel
 * itself — any interactive content inside remains the consumer's responsibility.
 */
export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;
export const HoverCardPortal = HoverCardPrimitive.Portal;

export const HoverCardContent = forwardRef<
  ElementRef<typeof HoverCardPrimitive.Content>,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <HoverCardPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-md border border-border bg-bg p-4 text-fg shadow-md outline-none",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        "motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  </HoverCardPrimitive.Portal>
));
HoverCardContent.displayName = "HoverCardContent";
