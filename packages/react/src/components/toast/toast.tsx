"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { type ComponentProps } from "react";

import { cn } from "../../lib/cn";

/**
 * Toaster — mount once at the app root (e.g. in `layout.tsx`).
 * Brand-styled wrapper around Sonner's `<Toaster />`.
 *
 * @example
 *   import { Toaster, toast } from "@willink-labs/react";
 *
 *   // app root
 *   <Toaster />
 *
 *   // anywhere
 *   toast.success("Saved");
 *   toast.error("Failed", { description: "Try again" });
 *   toast.promise(savePromise, { loading: "Saving...", success: "Saved", error: "Failed" });
 */
export const Toaster = ({
  className,
  toastOptions,
  ...props
}: ComponentProps<typeof SonnerToaster>) => (
  <SonnerToaster
    className={cn("toaster group", className)}
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-bg group-[.toaster]:text-fg group-[.toaster]:border-border group-[.toaster]:shadow-md group-[.toaster]:rounded-lg",
        description: "group-[.toast]:text-muted",
        actionButton:
          "group-[.toast]:bg-brand group-[.toast]:text-brand-fg group-[.toast]:rounded-md",
        cancelButton:
          "group-[.toast]:bg-neutral-100 group-[.toast]:text-fg group-[.toast]:rounded-md",
      },
      ...toastOptions,
    }}
    {...props}
  />
);
Toaster.displayName = "Toaster";

/** Re-export Sonner's `toast()` helper for direct usage. */
export const toast = sonnerToast;
