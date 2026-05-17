# Changelog

All notable changes to `@willink-labs/css-tokens` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). This package moves in lockstep with `@willink-labs/{tokens,tailwind-preset,react}` — it joins the monorepo at `0.13.0` so its version number aligns with the rest of the system from day one. (See ADR-0011 for the rationale.)

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
