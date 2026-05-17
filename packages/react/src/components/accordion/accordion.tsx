import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type ReactNode,
} from "react";

import { cn } from "../../lib/cn";

export const Accordion = AccordionPrimitive.Root;

/**
 * AccordionItem visual variants.
 *
 * - `flat` (default・後方互換): 0.4.x 動作と同等。横一列のフラット list
 *   (`border-b` で区切る)。設定不要で従来 consumer に影響なし。
 * - `card`: rounded card 形式。card 間に gap を入れて独立した要素として描画。
 *   Marketing FAQ 等で各項目を強調したい時に。
 * - `bordered`: 全周 border のシンプル箱形式。card より軽量。
 */
const accordionItemVariants = cva("transition-all", {
  variants: {
    variant: {
      flat: "border-b border-border last:border-b-0",
      card: "rounded-xl border border-border bg-bg shadow-soft mb-3 last:mb-0 overflow-hidden data-[state=open]:shadow-md",
      bordered: "rounded-md border border-border mb-2 last:mb-0",
    },
  },
  defaultVariants: {
    variant: "flat",
  },
});

export type AccordionItemProps = ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Item
> &
  VariantProps<typeof accordionItemVariants>;

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant }), className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export { accordionItemVariants };

export type AccordionTriggerProps = ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  /**
   * Trailing icon. Defaults to a `ChevronDown` that rotates 180° on open
   * (= 0.4.x 動作・後方互換)。
   *
   * Custom icons can target the open / closed state via the `group/trigger`
   * named group that DS adds to the trigger button. Example for Plus/Minus:
   *
   *   icon={(
   *     <>
   *       <Plus className="block group-data-[state=open]/trigger:hidden" />
   *       <Minus className="hidden group-data-[state=open]/trigger:block" />
   *     </>
   *   )}
   */
  icon?: ReactNode;
};

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group/trigger flex flex-1 items-center justify-between py-4 text-base font-semibold text-fg",
        "transition-all hover:text-brand",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
      {...props}
    >
      {children}
      {icon ?? (
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted transition-transform duration-accordion group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm text-fg",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      "motion-reduce:animate-none",
      className,
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";
