# @willink-labs/css-tokens

Framework-agnostic CSS variables export of the i-Willink Design System tokens. Drop into any stylesheet — no Tailwind, no bundler integration required.

**When to use this package** — your consumer is plain CSS, WordPress (PHP themes like Esperanza), Astro, Vue, Svelte, SolidJS, or any other environment where you cannot install the `@willink-labs/tailwind-preset`. If you _can_ install the Tailwind preset, prefer it — it ships the full OKLCH-derived brand scale that this package does not replicate.

## Install

```bash
pnpm add @willink-labs/css-tokens
```

No auth, no `.npmrc`. Public on npmjs.org.

## Use

The package ships five CSS files. Pick the ones that match your needs:

| File | Content | Recommended for |
|---|---|---|
| `@willink-labs/css-tokens/tokens.css` | primitive + semantic (full) | most consumers |
| `@willink-labs/css-tokens/tokens.scale.css` | primitive only | low-level — you'll build your own semantic layer |
| `@willink-labs/css-tokens/tokens.semantic.css` | semantic only (assumes primitives loaded separately) | layered token loading |
| `@willink-labs/css-tokens/tokens.dark.css` | dark-mode semantic overrides (1.2.0+) — import **after** the base file | consumers that want dark mode |
| `@willink-labs/css-tokens/tokens.primitives.css` | **color-free** primitives (1.3.0+): radius + duration + easing only — zero `--color-*` / `--shadow-*` vars | consumers that keep their own palette and adopt only the DS shape/motion contract (e.g. WordPress themes like Esperanza) |

```css
/* app.css */
@import "@willink-labs/css-tokens/tokens.css";

body {
  background: var(--color-bg);
  color: var(--color-fg);
}

.button-primary {
  background: var(--color-brand);
  color: var(--color-brand-fg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-glow);
  transition: background var(--duration-fast) var(--ease-standard);
}
```

## PostCSS toolchains — plain paths just work (1.3.0+)

Plain-path resolvers — **postcss-import** (and therefore the Tailwind **v3** CLI), classic Sass setups, anything that treats `@import "@willink-labs/css-tokens/tokens.css"` as a literal path inside `node_modules` — never read the package `exports` map. Before 1.3.0 those toolchains could not resolve the documented specifiers and had to import the physical `src/` path as a workaround.

Since 1.3.0 every documented file also exists as a **root-level proxy** (`tokens.css`, `tokens.scale.css`, `tokens.semantic.css`, `tokens.dark.css`, `tokens.primitives.css` — each a one-line `@import "./src/<same>.css";`), so the plain path resolves as a physical file:

```css
/* works in postcss-import / Tailwind v3 CLI / Vite / webpack alike */
@import "@willink-labs/css-tokens/tokens.css";
```

The `exports` map is kept for resolvers that do read it, and the physical `src/` paths remain importable (`./src/*.css` passthrough) so the pilots' workaround imports keep working. Background and pilot evidence (wp-modern-starter-kit — canonical pattern; esperanza-wp-theme — production): [ADR-0014](../../docs/adr/0014-wordpress-consumption.md).

## Color-free primitives — `tokens.primitives.css` (1.3.0+)

For consumers whose DS contract is **shape/motion only** — they keep their own palette. The file carries radius + duration + easing (10 variables) and **zero** `--color-*` / `--shadow-*` declarations, so importing it cannot leak inert color variables into your CSS (the esperanza-wp-theme pilot was ingesting 50 unused color/shadow vars through `tokens.scale.css` before this file existed):

```css
@import "@willink-labs/css-tokens/tokens.primitives.css";

.card {
  border-radius: var(--radius-lg);
  transition: transform var(--duration-fast) var(--ease-standard);
}
```

## Dark mode (1.2.0+)

`tokens.dark.css` ships the dark-mode overrides for every flipping semantic role, generated from the `$extensions["willink.dark"]` entries in `@willink-labs/tokens` `semantic.json`. Import it **after** the base file:

```css
@import "@willink-labs/css-tokens/tokens.css";
@import "@willink-labs/css-tokens/tokens.dark.css";
```

The `data-theme` contract (ADR-0013, identical to the Tailwind preset):

- **Auto** — with no `data-theme` attribute, `@media (prefers-color-scheme: dark)` flips the semantic roles to their dark values.
- **Force dark** — `<html data-theme="dark">` applies the dark values regardless of the OS preference.
- **Force light** — `<html data-theme="light">` opts out of the auto flip.

Only semantic roles flip (`bg`, `fg`, `muted`, `border`, the surface roles, brand state tokens, feedback colors). Primitives and the invariant roles (`ring`, `brand`, `brand-fg`, `brand-glow`, `accent-cyan`, `accent-pink`) stay constant — consumers styling against `var(--color-brand-600)` etc. under a dark root take responsibility for the contrast themselves. Note: the dark **shadow** overrides (`--shadow-soft` / `--shadow-md`) are a Tailwind-preset-level decision and are not part of this file; copy the two declarations from the preset's dark block if you need them.

## Override

The same single-line override pattern as the Tailwind preset:

```css
@import "@willink-labs/css-tokens/tokens.css";

:root {
  --color-brand: #2563eb;
}
```

Every semantic role that aliases `var(--color-brand)` (ring, brand-glow, etc.) cascades automatically. The numeric brand scale (`--color-brand-50` … `--color-brand-950`) is shipped as i-willink baseline hex values; if you need those steps to follow your override too, use `@willink-labs/tailwind-preset` instead (Tailwind v4 + `color-mix(in oklch, …)` is required to derive the scale at render time).

## What ships

- 60 primitive CSS variables (color scales, radius, duration, easing, shadow)
- 34 semantic roles (color slots + motion roles + easing roles)
- 16 dark-mode overrides in `tokens.dark.css` (one per flipping semantic role)
- 10 color-free primitives in `tokens.primitives.css` (radius + duration + easing — 1.3.0+)
- One declarative shorthand: `--color-brand: var(--color-brand-600)`
- 5 root-level proxy files so plain-path (non-`exports`-map) resolvers work (1.3.0+)

## Regenerate after a tokens change

```bash
pnpm -F @willink-labs/css-tokens generate
```

The script reads `@willink-labs/tokens/src/{primitive,semantic}.json` and rewrites the five CSS files under `src/` plus the root-level proxies. The generated files are committed so consumers do not need a build step.

## Versioning

Lockstep with `@willink-labs/tokens` / `tailwind-preset` / `react` — the npm packages move in unison. See the [v1.0 release roadmap](../../docs/roadmap/v1.0.md).
