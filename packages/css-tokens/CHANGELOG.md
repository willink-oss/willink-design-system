# Changelog

All notable changes to `@willink-labs/css-tokens` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This package moves in lockstep with `@willink-labs/{tokens,tailwind-preset,react}` — it joins the monorepo at `0.13.0` so its version number aligns with the rest of the system from day one. (See ADR-0011 for the rationale.)

## [1.1.0] — 2026-06-11

### Lockstep bump (no css-tokens source change)

Pair with `@willink-labs/react@1.1.0` (sonner 1.7.4 → 2.0.7 migration with a compat shim keeping the frozen Toaster surface, and a Slider single-thumb accessible-name fix). No source change in this package — published to keep the lockstep version set aligned per the monorepo convention.

## [1.0.0] — 2026-05-17

### API freeze (lockstep cut)

First stable release. The three exported CSS files (`tokens.css` / `tokens.scale.css` / `tokens.semantic.css`) and the set of `--variable` names they declare are now part of the SemVer-2.0 contract. Renaming or removing a variable, or changing a primitive hex value, is a MAJOR per [ADR-0010](../../docs/adr/0010-semver-policy.md).

No content change vs. 0.13.0; the package joined the monorepo at the current lockstep version (0.13.0) precisely so its 1.0.0 cut coincides with the rest of the npm group. The generator (`scripts/generate.mjs`) is implementation detail and may evolve under PATCH bumps as long as the emitted CSS is byte-equivalent.

## [0.13.0] — 2026-05-17

### Initial release

Framework-agnostic CSS variables export of the DS tokens — for plain CSS, WordPress (PHP), Astro, Vue, Svelte, SolidJS, and any other consumer that cannot run the Tailwind v4 preset.

Ships three CSS files generated from `@willink-labs/tokens` DTCG JSON:

- `tokens.css` — primitive + semantic (60 + 25 = 85 CSS variables)
- `tokens.scale.css` — primitives only (numeric scale steps)
- `tokens.semantic.css` — semantic roles only (assumes primitives loaded)

DTCG alias references (`{color.brand.600}`) are emitted as `var(--color-brand-600)` so consumer `:root` overrides cascade into dependent semantic roles, mirroring the Tailwind preset behavior.

The package does **not** replicate the OKLCH-derived brand scale that the Tailwind preset computes at render time — consumers needing brand-axis derivation should use `@willink-labs/tailwind-preset`. This package emits the i-willink baseline hex values for each numeric step.

Motivated by ADR-0008 (DS scope — Esperanza WP integration, stage 2 of the original plan); see ADR-0011 for the package design.
