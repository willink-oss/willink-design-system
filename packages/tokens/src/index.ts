// Re-export tokens as TypeScript values for downstream consumers (Phase 2 Flutter codegen の入力源にもなる)
import primitive from "./primitive.json" with { type: "json" };
import semantic from "./semantic.json" with { type: "json" };
import willink from "./brand/willink.json" with { type: "json" };
import clublink from "./brand/clublink.json" with { type: "json" };

export const tokens = {
  primitive,
  semantic,
  brand: {
    willink,
    clublink,
  },
} as const;

export type BrandKey = keyof typeof tokens.brand;
export const BRAND_KEYS = Object.keys(tokens.brand) as BrandKey[];
