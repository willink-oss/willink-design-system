// Re-export tokens as TypeScript values for downstream consumers
// (Phase 2 Flutter codegen の入力源にもなる).
//
// Brand axes (willink / clublink / fitai) were removed in 0.8.0.
// Consumers customize brand color via CSS variables override in their own
// globals.css — e.g.
//   :root { --color-brand: #2563eb; --color-brand-glow: #60a5fa; }
// See README.md "Customizing colors" for details.
import primitive from "./primitive.json" with { type: "json" };
import semantic from "./semantic.json" with { type: "json" };

export const tokens = {
  primitive,
  semantic,
} as const;
