import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

import { cn } from "../../lib/cn";

/**
 * Collapsible — single open/closed disclosure region (Radix).
 *
 * A lightweight, headless show/hide primitive: one `CollapsibleTrigger`
 * toggles the visibility of one `CollapsibleContent`. Unlike Accordion (a set
 * of mutually-aware items with rotate-chevron affordance + height animation),
 * Collapsible is the bare disclosure building block — useful for "show more"
 * rows, optional filters, or nesting your own composed widgets.
 *
 *   <Collapsible>
 *     <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *     <CollapsibleContent>…</CollapsibleContent>
 *   </Collapsible>
 *
 * Motion: intentionally NO height animation. Radix exposes
 * `--radix-collapsible-content-height`, but the DS preset ships no collapsible
 * keyframes, so `CollapsibleContent` adds no `animate-*` class (and therefore
 * needs no `motion-reduce` contract). Consumers remain free to style content.
 *
 * a11y: Radix wires `aria-expanded` / `aria-controls` on the trigger and
 * `hidden` on the closed content automatically.
 */
export const Collapsible = CollapsiblePrimitive.Root;

export const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

export const CollapsibleContent = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn("text-sm text-fg", className)}
    {...props}
  />
));
CollapsibleContent.displayName = "CollapsibleContent";
