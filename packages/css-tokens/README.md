# @willink-labs/css-tokens

Framework-agnostic CSS variables export of the i-Willink Design System tokens. Drop into any stylesheet — no Tailwind, no bundler integration required.

**When to use this package** — your consumer is plain CSS, WordPress (PHP themes like Esperanza), Astro, Vue, Svelte, SolidJS, or any other environment where you cannot install the `@willink-labs/tailwind-preset`. If you _can_ install the Tailwind preset, prefer it — it ships the full OKLCH-derived brand scale that this package does not replicate.

## Install

```bash
pnpm add @willink-labs/css-tokens
```

No auth, no `.npmrc`. Public on npmjs.org.

## Use

The package ships three CSS files. Pick the one that matches your needs:

| File | Content | Recommended for |
|---|---|---|
| `@willink-labs/css-tokens/tokens.css` | primitive + semantic (full) | most consumers |
| `@willink-labs/css-tokens/tokens.scale.css` | primitive only | low-level — you'll build your own semantic layer |
| `@willink-labs/css-tokens/tokens.semantic.css` | semantic only (assumes primitives loaded separately) | layered token loading |

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
- 25 semantic roles (color slots + motion roles + easing roles)
- One declarative shorthand: `--color-brand: var(--color-brand-600)`

## Regenerate after a tokens change

```bash
pnpm -F @willink-labs/css-tokens generate
```

The script reads `@willink-labs/tokens/src/{primitive,semantic}.json` and rewrites the three CSS files under `src/`. The generated files are committed so consumers do not need a build step.

## Versioning

Lockstep with `@willink-labs/tokens` / `tailwind-preset` / `react` — the npm packages move in unison. See the [v1.0 release roadmap](../../docs/roadmap/v1.0.md).
