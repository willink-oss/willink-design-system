#!/usr/bin/env node
/**
 * Generate CSS variable files from @willink-labs/tokens DTCG JSON.
 *
 * Inputs:
 *   packages/tokens/src/primitive.json
 *   packages/tokens/src/semantic.json
 *
 * Outputs (written to ./src/):
 *   tokens.scale.css      — primitives only (color / radius / duration / easing / shadow)
 *   tokens.semantic.css   — semantic roles only (color slots / motion roles / easing roles)
 *   tokens.css            — both combined (the recommended single-import entry)
 *
 * Design choice on alias resolution
 * ---------------------------------
 * DTCG `"{color.brand.600}"` references are translated to
 * `var(--color-brand-600)` rather than the literal hex value. This keeps
 * the consumer's `:root` override surface working — a consumer changing
 * `--color-brand-600` sees every dependent semantic role (e.g. ring,
 * brand-soft-fg) follow automatically, the same way they do with the
 * Tailwind preset.
 *
 * A DTCG reference to a group (no subscript, e.g. `"{color.brand}"`) is
 * supported via a small shorthand layer: the emitted CSS adds
 * `--color-brand: var(--color-brand-600);` so `var(--color-brand)`
 * resolves correctly. This mirrors the convention already in use in
 * `@willink-labs/tailwind-preset/preset.css`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensRoot = path.resolve(__dirname, "../../tokens/src");
const outDir = path.resolve(__dirname, "../src");

const primitive = JSON.parse(
  fs.readFileSync(path.join(tokensRoot, "primitive.json"), "utf8"),
);
const semantic = JSON.parse(
  fs.readFileSync(path.join(tokensRoot, "semantic.json"), "utf8"),
);

function isLeaf(node) {
  return (
    typeof node === "object" &&
    node !== null &&
    "$value" in node &&
    "$type" in node
  );
}

/**
 * Rename DTCG group keys to match the conventions used in
 * `@willink-labs/tailwind-preset/preset.css`. Keeps the consumer's
 * mental model of `var(--ease-…)` consistent across the two distribution
 * paths.
 */
const KEY_RENAMES = {
  easing: "ease",
};
function rename(key) {
  return KEY_RENAMES[key] ?? key;
}

/**
 * Translate a DTCG alias `"{a.b.c}"` → `"var(--a-b-c)"`.
 * Literal values (hex, ms, cubic-bezier, …) pass through unchanged.
 */
function translateAlias(value) {
  if (typeof value !== "string") return value;
  if (!value.startsWith("{") || !value.endsWith("}")) return value;
  const segments = value.slice(1, -1).split(".").map(rename);
  return `var(--${segments.join("-")})`;
}

/** Walk DTCG tree → emit `--prefix-key: value;` declarations. */
function flatten(obj, prefix) {
  const out = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    if (typeof value !== "object" || value === null) continue;
    const nextPrefix = `${prefix}-${rename(key)}`;
    if (isLeaf(value)) {
      out.push(`${nextPrefix}: ${translateAlias(value.$value)};`);
    } else {
      out.push(...flatten(value, nextPrefix));
    }
  }
  return out;
}

function header(kind) {
  return `/**
 * @willink-labs/css-tokens — ${kind}
 *
 * Generated from @willink-labs/tokens (DTCG JSON) — do not edit by hand.
 * Regenerate with \`pnpm -F @willink-labs/css-tokens generate\` after the
 * source tokens change.
 *
 * Usage:
 *   @import "@willink-labs/css-tokens/tokens.css";
 *
 * Override on :root the same way as the Tailwind preset:
 *   :root { --color-brand: #2563eb; }
 *
 * Notes
 * - DTCG alias references are emitted as \`var(--...)\` so consumer
 *   :root overrides cascade into dependent semantic roles.
 * - The OKLCH-derived brand scale that the Tailwind preset computes at
 *   render time (\`color-mix(in oklch, var(--color-brand), …)\`) is NOT
 *   replicated here — this package emits the i-willink baseline hex
 *   values for each numeric step. Consumers wanting full brand-axis
 *   derivation should use \`@willink-labs/tailwind-preset\` instead.
 */
`;
}

function wrap(kind, lines) {
  return `${header(kind)}:root {
${lines.map((l) => (l === "" ? "" : `  ${l}`)).join("\n")}
}
`;
}

const primitiveLines = flatten(primitive, "-");

// Brand group shorthand — `--color-brand` (without numeric subscript) maps to
// brand-600 (i-willink primary). Mirrors the convention in tailwind-preset
// (`--color-brand: #7c3aed;` declared alongside the numeric scale) and makes
// semantic references like `{color.brand}` resolve via the shorthand alias.
primitiveLines.push(
  "",
  "/* Group shorthand — `--color-brand` (no subscript) maps to brand-600.",
  " * Mirrors the convention in @willink-labs/tailwind-preset. */",
  "--color-brand: var(--color-brand-600);",
);

const semanticLines = flatten(semantic, "-");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "tokens.scale.css"),
  wrap("primitives (scale)", primitiveLines),
);
fs.writeFileSync(
  path.join(outDir, "tokens.semantic.css"),
  wrap("semantic roles", semanticLines),
);
fs.writeFileSync(
  path.join(outDir, "tokens.css"),
  wrap("primitives + semantic (full)", [
    "/* Primitives */",
    ...primitiveLines,
    "",
    "/* Semantic roles */",
    ...semanticLines,
  ]),
);

const declCount = (lines) =>
  lines.filter((l) => l.startsWith("--")).length;
console.log(
  `Generated ${declCount(primitiveLines)} primitive + ${declCount(semanticLines)} semantic CSS variables in ${outDir}`,
);
