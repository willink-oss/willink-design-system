#!/usr/bin/env node
/**
 * WCAG 2.1 contrast audit — semantic palette, light AND dark (ADR-0013).
 *
 * Resolves the semantic color roles from packages/tokens/src/{primitive,semantic}.json
 * (dark values come from the per-token `$extensions["willink.dark"]` entries) and
 * computes WCAG 2.1 relative-luminance contrast ratios for the key text/background
 * pairs in both modes.
 *
 * Required thresholds (FAIL → exit 1):
 *   fg/bg                              ≥ 7.0  (both modes — AAA body text)
 *   fg-strong/bg                       ≥ 7.0  (both modes — AAA emphasis, ADR-0016)
 *   fg-emphasis/bg                     ≥ 7.0  (both modes — AAA emphasis, ADR-0016)
 *   fg-secondary/bg                    ≥ 4.5  (both modes — AA secondary body, ADR-0016)
 *   muted/bg                           ≥ 4.5  (both modes)
 *   brand-fg/brand                     ≥ 4.5  (both modes)
 *   brand-soft-fg/brand-soft           ≥ 4.5  (both modes)
 *   brand-soft-fg/bg                   ≥ 4.5  (both modes — Button link resting, #58/ADR-0017)
 *   brand-hover/bg                     ≥ 4.5  (both modes — Button link / Accordion-trigger hover, #58)
 *   surface-inverted-fg/surface-inverted ≥ 4.5 (both modes)
 *   success|warning|danger on bg       ≥ 4.5  (DARK mode only)
 *
 * Report-only documented baselines (printed with ⚠ if < 4.5, never fatal):
 *   success|warning|danger on bg in LIGHT mode — pre-existing 1.x values
 *   #ffffff on danger (AlertDialog destructive action), both modes
 *   fg-subtle/bg, fg-faint/bg (ADR-0016) — captions/meta and disabled/separator
 *     tiers; intentionally below the 4.5 body-text floor (like muted on white),
 *     documented here so the floor is a visible number, not folklore
 *
 * Gradient-text audit (1.7.0+ / ADR-0018) — closes a real audit BLIND SPOT.
 *   The per-pair checks above only see flat token roles; they could not see
 *   `bg-clip-text text-transparent` gradient HEADINGS (e.g. text-gradient-
 *   primary), so a clipped heading whose worst endpoint washed out on the dark
 *   bg passed CI silently — it was caught twice only by manual review. The
 *   TEXT_GRADIENTS registry below declares every preset gradient utility that
 *   is CLIPPED TO TEXT, with its endpoints PER MODE, and asserts the WORST
 *   endpoint clears the floor against `bg`:
 *     DARK  — required ≥ 4.5 (the bug class; FAIL → exit 1)
 *     LIGHT — report-only baseline (the legacy fixed brand pair ships byte-
 *             identical; worst endpoint clears the 3:1 large-text floor — these
 *             are display headings — but sits just under 4.5, like the feedback
 *             colors on white above). Printed with ⚠, never fatal.
 *   Vivid bg-only gradients behind white text (bg-gradient-primary / -ai) are
 *   NOT in the registry — they are not text; see ADR-0018 for why.
 *
 * Brand numeric steps: the Tailwind preset derives brand-50…950 at render time
 * via `color-mix(in oklch, var(--color-brand) X%, white|black)` rather than
 * using the primitive.json hex ramp. For every pair that touches a brand step,
 * this script therefore audits BOTH values: the DTCG hex (what css-tokens
 * ships) and an OKLCH approximation of the preset's color-mix result. The
 * OKLCH math below (sRGB → OKLab → OKLCH and back, standard Björn Ottosson
 * matrices) is an APPROXIMATION of the browser's color-mix — browsers may
 * apply gamut mapping instead of per-channel clamping, so derived hexes can
 * differ by a hair; the contrast ratios are stable well past the thresholds.
 *
 * Usage: node scripts/check-contrast.mjs   (root: pnpm check-contrast)
 * Wired into CI forever via packages/tokens/__tests__/contrast.test.ts.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensRoot = path.resolve(__dirname, "../packages/tokens/src");

const primitive = JSON.parse(
  fs.readFileSync(path.join(tokensRoot, "primitive.json"), "utf8"),
);
const semantic = JSON.parse(
  fs.readFileSync(path.join(tokensRoot, "semantic.json"), "utf8"),
);

/* ============================================================
 * DTCG resolution
 * ============================================================ */

/** Resolve a DTCG value (literal hex or `{a.b.c}` alias) to a hex literal. */
function resolveValue(value) {
  if (typeof value !== "string") throw new Error(`Non-string token value: ${value}`);
  if (!value.startsWith("{")) return value.toLowerCase();
  const segments = value.slice(1, -1).split(".");
  let node = primitive;
  for (const seg of segments) node = node?.[seg];
  // Group shorthand `{color.brand}` → brand.600 (mirrors the preset convention)
  if (node && !("$value" in node) && node["600"]) node = node["600"];
  if (!node || !("$value" in node)) throw new Error(`Unresolvable alias: ${value}`);
  return resolveValue(node.$value);
}

/** Raw DTCG value string for a semantic color role in a given mode. */
function rawSemantic(name, mode) {
  const leaf = semantic.color[name];
  if (!leaf) throw new Error(`Unknown semantic color role: ${name}`);
  if (mode === "dark") {
    return leaf.$extensions?.["willink.dark"]?.$value ?? leaf.$value;
  }
  return leaf.$value;
}

/* ============================================================
 * OKLCH machinery (Björn Ottosson's OKLab — standard matrices)
 * ============================================================ */

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function rgbToHex([r, g, b]) {
  const c = (v) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function rgbToOklab([r, g, b]) {
  const [lr, lg, lb] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function oklabToOklch([L, a, b]) {
  return [L, Math.sqrt(a * a + b * b), (Math.atan2(b, a) * 180) / Math.PI];
}

function oklchToOklab([L, C, H]) {
  const rad = (H * Math.PI) / 180;
  return [L, C * Math.cos(rad), C * Math.sin(rad)];
}

/**
 * Approximate `color-mix(in oklch, <hex> pct%, white|black)`.
 * White (oklch 1 0 none) and black (oklch 0 0 none) are achromatic — their
 * hue is a CSS "missing" component, so the mixed hue carries over from the
 * chromatic color (CSS Color 4 §12.2); chroma interpolates against 0.
 */
function colorMixOklch(hex, pct, base) {
  const [L, C, H] = oklabToOklch(rgbToOklab(hexToRgb(hex)));
  const baseL = base === "white" ? 1 : 0;
  const mixed = [pct * L + (1 - pct) * baseL, pct * C, H];
  return rgbToHex(oklabToRgb(oklchToOklab(mixed)));
}

/** Preset mix ratios for the OKLCH-derived brand scale (preset.css 0.11.0+). */
const PRESET_BRAND_MIX = {
  50: [0.05, "white"],
  100: [0.12, "white"],
  200: [0.25, "white"],
  300: [0.42, "white"],
  400: [0.65, "white"],
  500: [0.85, "white"],
  600: null, // brand-600 IS --color-brand
  700: [0.85, "black"],
  800: [0.7, "black"],
  900: [0.55, "black"],
  950: [0.35, "black"],
};

const BRAND_BASE = resolveValue("{color.brand.600}");

/**
 * Given a raw DTCG value string, attach the `preset` OKLCH color-mix variant
 * when it is a numeric brand step the preset derives (anything but 600). The
 * Tailwind preset renders brand-50…950 via `color-mix(in oklch, …)` at run
 * time rather than from the DTCG hex, so both hexes are audited.
 */
function withPresetVariant(out, raw) {
  const m = typeof raw === "string" && raw.match(/^\{color\.brand\.(\d+)\}$/);
  if (m && PRESET_BRAND_MIX[m[1]]) {
    const [pct, base] = PRESET_BRAND_MIX[m[1]];
    out.preset = colorMixOklch(BRAND_BASE, pct, base);
  }
  return out;
}

/**
 * Resolve a semantic role (or `#hex` literal) in a mode, returning every hex
 * variant that consumers can actually see:
 *   - `tokens`: the DTCG hex ramp (what @willink-labs/css-tokens ships)
 *   - `preset`: OKLCH color-mix approximation (what the Tailwind preset
 *     renders) — only present when the role resolves to a numeric brand step
 *     other than 600.
 */
function variantsOf(roleOrHex, mode) {
  if (roleOrHex.startsWith("#")) return { tokens: roleOrHex.toLowerCase() };
  const raw = rawSemantic(roleOrHex, mode);
  return withPresetVariant({ tokens: resolveValue(raw) }, raw);
}

/**
 * Resolve a gradient ENDPOINT spec to its hex variants. Endpoints are written
 * the way the preset declares them: either a primitive/brand alias string like
 * `{color.brand.300}` / `{color.cyan.500}`, or a `#hex` literal. (Gradient
 * endpoints are preset-internal `--color-gradient-*` vars — NOT semantic.json
 * roles — so they are declared inline in TEXT_GRADIENTS below per mode.)
 */
function endpointVariants(spec) {
  if (spec.startsWith("#")) return { tokens: spec.toLowerCase() };
  return withPresetVariant({ tokens: resolveValue(spec) }, spec);
}

/* ============================================================
 * WCAG 2.1 contrast
 * ============================================================ */

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fgHex, bgHex) {
  const [l1, l2] = [luminance(fgHex), luminance(bgHex)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/* ============================================================
 * Pair definitions
 * ============================================================ */

const PAIRS = [
  { fg: "fg", bg: "bg", min: 7.0, required: { light: true, dark: true }, note: "body text" },
  // Text emphasis ladder (ADR-0016). strong/emphasis target AAA (≥7);
  // secondary targets AA (≥4.5); subtle/faint are non-body tiers documented
  // below their floor (report-only, like muted on white in light mode).
  { fg: "fg-strong", bg: "bg", min: 7.0, required: { light: true, dark: true }, note: "emphasis (headings/strong)" },
  { fg: "fg-emphasis", bg: "bg", min: 7.0, required: { light: true, dark: true }, note: "emphasis (labels/links)" },
  { fg: "fg-secondary", bg: "bg", min: 4.5, required: { light: true, dark: true }, note: "secondary body" },
  { fg: "fg-subtle", bg: "bg", min: 4.5, required: { light: false, dark: false }, note: "captions/meta (non-body tier)" },
  { fg: "fg-faint", bg: "bg", min: 4.5, required: { light: false, dark: false }, note: "disabled/separator (non-text tier)" },
  { fg: "muted", bg: "bg", min: 4.5, required: { light: true, dark: true }, note: "secondary text" },
  { fg: "brand-fg", bg: "brand", min: 4.5, required: { light: true, dark: true }, note: "primary Button" },
  { fg: "brand-soft-fg", bg: "brand-soft", min: 4.5, required: { light: true, dark: true }, note: "Badge soft" },
  // Brand text directly on the page background (ADR-0017 #58). The link Button
  // resting color and the Accordion-trigger hover are brand text on `bg`. The
  // old mode-invariant `text-brand` (brand-600) failed here in dark (3.54:1);
  // both now use FLIPPING roles, gated to AA in both modes.
  { fg: "brand-soft-fg", bg: "bg", min: 4.5, required: { light: true, dark: true }, note: "Button link resting (#58)" },
  { fg: "brand-hover", bg: "bg", min: 4.5, required: { light: true, dark: true }, note: "Button link / Accordion-trigger hover (#58)" },
  { fg: "surface-inverted-fg", bg: "surface-inverted", min: 4.5, required: { light: true, dark: true }, note: "Tooltip" },
  { fg: "success", bg: "bg", min: 4.5, required: { light: false, dark: true }, note: "feedback text" },
  { fg: "warning", bg: "bg", min: 4.5, required: { light: false, dark: true }, note: "feedback text" },
  { fg: "danger", bg: "bg", min: 4.5, required: { light: false, dark: true }, note: "feedback text" },
  { fg: "#ffffff", bg: "danger", min: 4.5, required: { light: false, dark: false }, note: "AlertDialog destructive action" },
];

/* ============================================================
 * Gradient-text registry (1.7.0+ / ADR-0018)
 *
 * The audit blind spot: a `bg-clip-text text-transparent` heading renders the
 * GRADIENT as the glyph color, but the flat-role checks above only know about
 * `--color-*` token roles, so a clipped heading whose worst endpoint washed out
 * on the dark bg passed CI (it was caught twice only by a human). This registry
 * declares every preset `@utility` that is clipped to text, with its endpoints
 * PER MODE, exactly as preset.css resolves the `--color-gradient-*-from/-to`
 * vars. The check asserts the WORST (lowest-contrast) endpoint against `bg`:
 *   dark  → required ≥ floor (FAIL → exit 1)   — the bug class, frozen
 *   light → report-only baseline (legacy fixed brand pair, byte-identical;
 *           clears the 3:1 large-text floor but sits under 4.5, like the
 *           feedback colors on white). Never fatal.
 *
 * Endpoints are written as the preset writes them: `{color.brand.N}` primitive
 * aliases (audited in BOTH the DTCG hex and the preset's OKLCH color-mix
 * rendering, like the brand pairs above). Add a row here whenever a new
 * text-clipped gradient `@utility` is added to preset.css — that is the
 * maintenance contract that keeps this blind spot closed.
 *
 * NOT listed (intentionally): bg-gradient-primary / bg-gradient-ai. They are
 * decorative SECTION backgrounds sitting behind white text, not clipped text;
 * white-on-endpoint is governed by the brand-fg / surface pairs and the design
 * intent (vivid panels), not the text floor. See ADR-0018.
 */
const TEXT_GRADIENTS = [
  {
    utility: "text-gradient-primary",
    floor: 4.5,
    required: { light: false, dark: true },
    // endpoints per mode, in preset.css order (from → to)
    endpoints: {
      light: ["{color.brand.600}", "{color.brand.500}"], // brand → brand-glow (byte-identical to pre-1.7)
      dark: ["{color.brand.300}", "{color.brand.400}"], // dark-aware: brightened so the clipped heading stays legible
    },
    note: "clipped heading (bg-clip-text)",
  },
];

let failures = 0;
const fmt = (n) => n.toFixed(2).padStart(5);

for (const mode of ["light", "dark"]) {
  console.log(`\n=== ${mode.toUpperCase()} ===`);
  for (const pair of PAIRS) {
    const fgVariants = variantsOf(pair.fg, mode);
    const bgVariants = variantsOf(pair.bg, mode);
    const required = pair.required[mode];
    const sources = new Set([
      ...Object.keys(fgVariants),
      ...Object.keys(bgVariants),
    ]);
    // "preset" rows only exist when at least one side is a derived brand step
    for (const source of sources) {
      if (source === "preset" && !("preset" in fgVariants) && !("preset" in bgVariants)) continue;
      const fgHex = fgVariants[source] ?? fgVariants.tokens;
      const bgHex = bgVariants[source] ?? bgVariants.tokens;
      const ratio = contrast(fgHex, bgHex);
      const pass = ratio >= pair.min;
      let status;
      if (pass) status = "✓ PASS";
      else if (required) {
        status = "✗ FAIL";
        failures++;
      } else status = "⚠ BASELINE (report-only)";
      const sourceTag = source === "preset" ? " [preset color-mix approx]" : "";
      const reqTag = required ? `min ${pair.min}` : `min ${pair.min} (non-fatal)`;
      console.log(
        `  ${(pair.fg + " / " + pair.bg).padEnd(40)} ${fgHex} on ${bgHex}  ${fmt(ratio)}:1  ${reqTag.padEnd(18)} ${status}${sourceTag}  — ${pair.note}`,
      );
    }
  }

  /* --- Gradient-text checks (ADR-0018): worst endpoint vs bg --- */
  console.log(`  --- text gradients (worst endpoint vs bg) ---`);
  const bgGrad = variantsOf("bg", mode);
  for (const grad of TEXT_GRADIENTS) {
    const required = grad.required[mode];
    // Evaluate every shared source (tokens / preset color-mix) across all
    // endpoints; the gradient's worst endpoint is the binding one.
    const endpointVar = grad.endpoints[mode].map(endpointVariants);
    const sources = new Set(["tokens", ...endpointVar.flatMap(Object.keys)]);
    for (const source of sources) {
      if (source === "preset" && !endpointVar.some((e) => "preset" in e)) continue;
      const bgHex = bgGrad[source] ?? bgGrad.tokens;
      // worst = lowest contrast among the gradient's endpoints
      let worst = null;
      for (let i = 0; i < endpointVar.length; i++) {
        const epHex = endpointVar[i][source] ?? endpointVar[i].tokens;
        const ratio = contrast(epHex, bgHex);
        if (worst === null || ratio < worst.ratio) {
          worst = { ratio, epHex, idx: i };
        }
      }
      const pass = worst.ratio >= grad.floor;
      let status;
      if (pass) status = "✓ PASS";
      else if (required) {
        status = "✗ FAIL";
        failures++;
      } else status = "⚠ BASELINE (report-only)";
      const sourceTag = source === "preset" ? " [preset color-mix approx]" : "";
      const reqTag = required ? `min ${grad.floor}` : `min ${grad.floor} (non-fatal)`;
      const which = `endpoint ${worst.idx + 1}/${endpointVar.length}`;
      console.log(
        `  ${(grad.utility + " (worst)").padEnd(40)} ${worst.epHex} on ${bgHex}  ${fmt(worst.ratio)}:1  ${reqTag.padEnd(18)} ${status}${sourceTag}  — ${grad.note} [${which}]`,
      );
    }
  }
}

console.log();
if (failures > 0) {
  console.error(`✗ ${failures} required contrast pair(s) below threshold.`);
  console.error("  Adjust the willink.dark $extensions in semantic.json within the existing primitives (see ADR-0013).");
  process.exit(1);
}
console.log("✓ All required WCAG 2.1 contrast pairs (incl. text-gradient worst endpoints) pass in both modes.");
console.log("  (⚠ rows are documented baselines — see ADR-0013 / ADR-0018 / docs/a11y/matrix.md + gradient-and-accent.md.)");
