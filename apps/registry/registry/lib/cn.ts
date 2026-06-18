import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — combine class names with clsx and de-conflict Tailwind utilities with
 * tailwind-merge. The shared class combiner used by every @willink component
 * and block.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
