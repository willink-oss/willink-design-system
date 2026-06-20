import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

import { cn } from "../../lib/cn";

/**
 * NavigationMenu — Radix navigation menu for site-level navigation.
 *
 * A horizontal menubar of triggers; each trigger reveals a floating content
 * panel rendered into a shared `NavigationMenuViewport`. Distinct from
 * DropdownMenu (action menu, `role="menu"`) — this is a `<nav>` landmark with
 * disclosure semantics for primary navigation links.
 *
 *   <NavigationMenu>
 *     <NavigationMenuList>
 *       <NavigationMenuItem>
 *         <NavigationMenuTrigger>Products</NavigationMenuTrigger>
 *         <NavigationMenuContent>
 *           <NavigationMenuLink href="/a">Item A</NavigationMenuLink>
 *         </NavigationMenuContent>
 *       </NavigationMenuItem>
 *       <NavigationMenuItem>
 *         <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
 *       </NavigationMenuItem>
 *     </NavigationMenuList>
 *   </NavigationMenu>
 *
 * The `Root` renders the `Viewport` by default; pass your own children-level
 * `NavigationMenuViewport` only when you need custom placement.
 */

/**
 * `navigationMenuTriggerStyle` — the ghost-like trigger appearance, exported so
 * consumers can style a custom `NavigationMenuLink` (top-level link without a
 * panel) to match the triggers that do open content.
 */
export const navigationMenuTriggerStyle = cva([
  "group inline-flex h-10 w-max items-center justify-center gap-1 rounded-full px-4 text-sm font-medium",
  "transition-colors",
  "hover:bg-surface-subtle focus:bg-surface-subtle",
  "data-[state=open]:bg-surface-subtle",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  "disabled:pointer-events-none disabled:opacity-50",
]);

export const NavigationMenu = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = "NavigationMenu";

export const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "flex flex-1 list-none items-center justify-center gap-1",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const NavigationMenuTrigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), className)}
    {...props}
  >
    {children}
    <ChevronDown
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

export const NavigationMenuContent = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full p-2 md:absolute md:w-auto",
      "rounded-md border border-border bg-bg text-fg shadow-md",
      "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
      "motion-reduce:animate-none",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = "NavigationMenuContent";

export const NavigationMenuLink = NavigationMenuPrimitive.Link;

export const NavigationMenuViewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className="absolute left-0 top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      className={cn(
        "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-top overflow-hidden rounded-md border border-border bg-bg text-fg shadow-md md:w-[var(--radix-navigation-menu-viewport-width)]",
        "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        "motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = "NavigationMenuViewport";

export const NavigationMenuIndicator = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-10 flex h-1.5 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-fade-in data-[state=hidden]:animate-fade-out",
      "motion-reduce:animate-none",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm border-l border-t border-border bg-bg shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = "NavigationMenuIndicator";
