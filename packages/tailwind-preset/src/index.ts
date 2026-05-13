// Path constants for consumers that need to reference the CSS files programmatically.
// The actual styles are loaded via CSS @import, not via JS bundling.
export const PRESET_CSS_PATH = "@willink-labs/tailwind-preset/preset.css";
/**
 * Available brand axes. Mirrors:
 * - `@willink-labs/tokens` (`tokens.brand.{willink,clublink,fitai}` since 0.5.0)
 * - `preset.css` (`[data-brand="willink|clublink|fitai"]` blocks)
 * - `brands/{willink,clublink,fitai}.css` (force-brand CSS files)
 * - Flutter `willink_theme` (`WillinkBrand.{willink,clublink,fitai}`)
 *
 * Single source of truth contract: when adding a new brand, update all of the
 * above + `packages/tokens/src/brand/<brand>.json` + Flutter
 * `packages/flutter_theme/lib/src/brand_axis.dart`.
 *
 * Issue #40 (5/10) — fitai が tokens/JSON/CSS/Flutter には存在するが TS
 * BRANDS const から漏れていた gap を 0.6.0 で解消。
 */
export const BRANDS = ["willink", "clublink", "fitai"] as const;
export type Brand = (typeof BRANDS)[number];
