// Path constants for consumers that need to reference the CSS files programmatically.
// The actual styles are loaded via CSS @import, not via JS bundling.
export const PRESET_CSS_PATH = "@willink-labs/tailwind-preset/preset.css";
export const BRANDS = ["willink", "clublink"] as const;
export type Brand = (typeof BRANDS)[number];
