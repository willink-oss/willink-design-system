"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { type ComponentProps, type ReactNode } from "react";

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
  icons,
  loadingIcon,
  pauseWhenPageIsHidden: _pauseWhenPageIsHidden,
  ...props
}: ComponentProps<typeof SonnerToaster> & {
  /**
   * @deprecated sonner 2.x removed `loadingIcon`. Kept for v1.x API
   * compatibility — mapped onto `icons.loading`. Prefer `icons={{ loading }}`.
   */
  loadingIcon?: ReactNode;
  /**
   * @deprecated sonner 2.x removed this option; it no longer has any effect.
   */
  pauseWhenPageIsHidden?: boolean;
}) => (
  <SonnerToaster
    className={cn("toaster group", className)}
    icons={loadingIcon ? { loading: loadingIcon, ...icons } : icons}
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-bg group-[.toaster]:text-fg group-[.toaster]:border-border group-[.toaster]:shadow-md group-[.toaster]:rounded-lg",
        description: "group-[.toast]:text-muted",
        actionButton:
          "group-[.toast]:bg-brand group-[.toast]:text-brand-fg group-[.toast]:rounded-md",
        cancelButton:
          "group-[.toast]:bg-surface-muted group-[.toast]:text-fg group-[.toast]:rounded-md",
      },
      ...toastOptions,
    }}
    {...props}
  />
);
Toaster.displayName = "Toaster";

/**
 * Re-export Sonner's `toast()` helper for direct usage.
 * The explicit `typeof` annotation keeps the emitted declaration a reference
 * to Sonner's own type — sonner 2.x no longer exports the internal types
 * (`PromiseIExtendedResult` etc.) its inferred expansion would need (TS4023).
 */
export const toast: typeof sonnerToast = sonnerToast;
