import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../lib/cn";

/**
 * Sheet — side drawer (Radix Dialog based)。
 *
 * shadcn の Sheet pattern を踏襲し、Dialog primitive を再利用して 4 方向の
 * slide-in drawer として提供する。`side` で位置決定 / size は不要 (side 軸で
 * 柔軟性を確保)。Animation は Dialog と同 motion token を使用。
 *
 * @example
 *   <Sheet>
 *     <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
 *     <SheetContent side="right">
 *       <SheetHeader>
 *         <SheetTitle>Title</SheetTitle>
 *         <SheetDescription>Description</SheetDescription>
 *       </SheetHeader>
 *       <p>Body</p>
 *       <SheetFooter><Button>Save</Button></SheetFooter>
 *     </SheetContent>
 *   </Sheet>
 */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
      "motion-reduce:animate-none",
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

/**
 * SheetContent visual variants — slide direction.
 *
 * - `right` (default): 右からスライドイン (mobile nav / detail panel 用途)
 * - `left`:  左からスライドイン (main nav 用途)
 * - `top`:   上からスライドイン (notification panel / command palette)
 * - `bottom`: 下からスライドイン (mobile action sheet)
 */
const sheetContentVariants = cva(
  [
    "fixed z-50 gap-4 bg-bg p-6 shadow-md",
    "border border-border",
    "motion-reduce:animate-none",
  ],
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 h-auto w-full border-b",
          "data-[state=open]:animate-sheet-in-top data-[state=closed]:animate-sheet-out-top",
        ],
        bottom: [
          "inset-x-0 bottom-0 h-auto w-full border-t",
          "data-[state=open]:animate-sheet-in-bottom data-[state=closed]:animate-sheet-out-bottom",
        ],
        left: [
          "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r",
          "data-[state=open]:animate-sheet-in-left data-[state=closed]:animate-sheet-out-left",
        ],
        right: [
          "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l",
          "data-[state=open]:animate-sheet-in-right data-[state=closed]:animate-sheet-out-right",
        ],
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

export type SheetContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> &
  VariantProps<typeof sheetContentVariants> & {
    /** Override the default close button (top-right ✕). Pass `false` to hide. */
    closeButton?: ReactNode | false;
    /** Render inside a Portal (default true). */
    portal?: boolean;
    /** Skip the overlay (rare). */
    overlay?: boolean;
  };

export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      className,
      children,
      side,
      closeButton,
      portal = true,
      overlay = true,
      ...props
    },
    ref,
  ) => {
    const inner = (
      <>
        {overlay ? <SheetOverlay /> : null}
        <DialogPrimitive.Content
          ref={ref}
          className={cn(sheetContentVariants({ side }), className)}
          {...props}
        >
          {children}
          {closeButton === false ? null : closeButton ? (
            closeButton
          ) : (
            <DialogPrimitive.Close
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none",
              )}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </>
    );
    return portal ? <SheetPortal>{inner}</SheetPortal> : inner;
  },
);
SheetContent.displayName = "SheetContent";

export const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

export const SheetFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

export const SheetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-fg", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export { sheetContentVariants };
