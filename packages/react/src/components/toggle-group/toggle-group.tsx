import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

import { cn } from "../../lib/cn";
import { toggleVariants } from "../toggle/toggle";

/**
 * ToggleGroup — Radix ToggleGroup wrapper、既存の toggleVariants 上に構築。
 *
 * variant/size は root から context 経由で各 ToggleGroupItem へ伝播する
 * (shadcn パターン)。item 側で個別に variant/size を指定して上書きも可能。
 *
 * @example
 *   <ToggleGroup type="single" defaultValue="bold">
 *     <ToggleGroupItem value="bold" aria-label="太字">B</ToggleGroupItem>
 *     <ToggleGroupItem value="italic" aria-label="斜体">I</ToggleGroupItem>
 *     <ToggleGroupItem value="underline" aria-label="下線">U</ToggleGroupItem>
 *   </ToggleGroup>
 */
// Empty default: context carries the root's variant/size only when set, so an
// item's own variant/size prop can override (item ?? context ?? toggleVariants default).
const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({});

export type ToggleGroupProps = ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  VariantProps<typeof toggleVariants>;

export const ToggleGroup = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));
ToggleGroup.displayName = "ToggleGroup";

export type ToggleGroupItemProps = ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Item
> &
  VariantProps<typeof toggleVariants>;

export const ToggleGroupItem = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, variant, size, children, ...props }, ref) => {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";
