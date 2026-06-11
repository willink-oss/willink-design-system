import * as SliderPrimitive from "@radix-ui/react-slider";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";

import { cn } from "../../lib/cn";

/**
 * Slider — range input。Radix Slider wrapper。
 *
 * @example
 *   <Slider defaultValue={[50]} max={100} step={1} />
 *   <Slider defaultValue={[20, 80]} max={100} aria-label="Range" />
 */
export const Slider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      "data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-track">
      <SliderPrimitive.Range className="absolute h-full bg-brand" />
    </SliderPrimitive.Track>
    {Array.isArray(props.value ?? props.defaultValue)
      ? (props.value ?? props.defaultValue)!.map((_, i, arr) => (
          <SliderPrimitive.Thumb
            key={i}
            // Radix only auto-labels thumbs in multi-thumb ranges
            // ("Minimum"/"Maximum"); a single thumb would have no accessible
            // name, so forward the root aria-label to it (axe
            // aria-input-field-name). Conditional spread: an explicit
            // aria-label={undefined} would override Radix's auto-labels.
            {...(arr.length === 1 ? { "aria-label": props["aria-label"] } : undefined)}
            className={cn(
              "block h-4 w-4 rounded-full border-2 border-brand bg-bg shadow-md transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              "disabled:pointer-events-none",
            )}
          />
        ))
      : (
          <SliderPrimitive.Thumb
            aria-label={props["aria-label"]}
            className={cn(
              "block h-4 w-4 rounded-full border-2 border-brand bg-bg shadow-md transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              "disabled:pointer-events-none",
            )}
          />
        )}
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";
