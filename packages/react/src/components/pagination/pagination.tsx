import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ComponentProps,
  type HTMLAttributes,
} from "react";

import { cn } from "../../lib/cn";
import { buttonVariants } from "../button/button";

export const Pagination = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  ),
);
Pagination.displayName = "Pagination";

export const PaginationContent = forwardRef<
  HTMLUListElement,
  HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = forwardRef<
  HTMLLIElement,
  HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn(className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

export type PaginationLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Marks this page as the current one (`aria-current="page"` + outline style). */
  isActive?: boolean;
  /** Button size from `buttonVariants` (default `sm`, squared to an icon button). */
  size?: "sm" | "md" | "lg";
};

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive = false, size = "sm", ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
        // square the button into an icon-sized cell (buttonVariants has no `icon` size)
        size === "sm" && "h-8 w-8 px-0",
        size === "md" && "h-10 w-10 px-0",
        size === "lg" && "h-14 w-14 px-0",
        className,
      )}
      {...props}
    />
  ),
);
PaginationLink.displayName = "PaginationLink";

export type PaginationPreviousProps = ComponentProps<typeof PaginationLink>;

export const PaginationPrevious = forwardRef<
  HTMLAnchorElement,
  PaginationPreviousProps
>(({ className, children, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="前のページ"
    className={cn("w-auto gap-1 px-4", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
    <span>{children ?? "前へ"}</span>
  </PaginationLink>
));
PaginationPrevious.displayName = "PaginationPrevious";

export type PaginationNextProps = ComponentProps<typeof PaginationLink>;

export const PaginationNext = forwardRef<HTMLAnchorElement, PaginationNextProps>(
  ({ className, children, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="次のページ"
      className={cn("w-auto gap-1 px-4", className)}
      {...props}
    >
      <span>{children ?? "次へ"}</span>
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </PaginationLink>
  ),
);
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-8 w-8 items-center justify-center text-fg-secondary",
      className,
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";
