# Changelog

All notable changes to `@willink-labs/tokens` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.12.0` for exact-minor stability). The npm packages
in this monorepo (`@willink-labs/tokens`, `@willink-labs/tailwind-preset`,
`@willink-labs/react`) move in lockstep — every release bumps all three to the
same minor.

## [0.13.0] — 2026-05-17

### Lockstep bump (no JSON change)

Pair with `@willink-labs/tailwind-preset@0.13.0` and `@willink-labs/react@0.13.0`, which add the `prefers-reduced-motion` contract — a Tailwind `motion-reduce:animate-none` variant on every animated component plus a CSS safety net in the preset. The token JSON did not change; the new behavior is purely CSS / component-side. See ADR-0008 (motion-contract) for the design rationale and [`docs/a11y/matrix.md`](../../docs/a11y/matrix.md) for the resulting WCAG 2.1 AA compliance per component.

## [0.12.0] — 2026-05-17

### Added — role-based motion + easing semantic tokens

`semantic.json` now defines a `motion` and an `easing` block alongside `color`. Each entry aliases a primitive (`{duration.fast}` etc.) under a role-based name so consumers and downstream packages can rewire a single interaction without touching primitives.

- `motion.modal-enter` / `motion.modal-exit` → `{duration.fast}`
- `motion.popover-enter` / `motion.popover-exit` → `{duration.fast}`
- `motion.tooltip-enter` / `motion.tooltip-exit` → `{duration.fast}`
- `motion.sheet` → `{duration.fast}`
- `motion.accordion` → `{duration.base}`
- `motion.toast` → `{duration.base}`
- `easing.enter` / `easing.exit` → `{easing.standard}`
- `easing.emphasized-enter` → `{easing.emphasized}`

`@willink-labs/tailwind-preset@0.12.0` mirrors these as CSS variables (`--duration-modal-enter`, …) and rewires every `@utility animate-*` to reference them. No primitive values changed; the alias chain resolves to the same durations and curves.

## [0.11.0] — 2026-05-17

### Lockstep bump (no JSON change)

Pair with `@willink-labs/tailwind-preset@0.11.0`, which makes the `--color-brand-{50…950}` scale OKLCH-derived from a single `--color-brand` axis. The token JSON did not change; `primitive.json` still ships the canonical `i-willink` violet ramp as documentation of the visual baseline, but downstream consumers of the CSS variables now see all 11 numeric steps derived from `--color-brand` at compile time.

## [0.10.0] — 2026-05-17

### Lockstep bump (no JSON change)

Pair with `@willink-labs/tailwind-preset@0.10.0`, which migrates the gradient utilities (`bg-gradient-{subtle,primary,ai}` / `text-gradient-primary`) off direct primitive scale references so `:root` overrides propagate.

## [0.9.0] — 2026-05-17

### Added — semantic brand state tokens

Added `brand-hover`, `brand-active`, `brand-soft`, `brand-soft-fg` semantic color slots so components (Button hover, Badge default, link hover) can resolve their state colors from semantic tokens instead of primitive scale steps. This closed the override gap that allowed primitive references inside component CSS to ignore consumer `:root` overrides.

## [0.8.0] — 2026-05-17

### Changed — single-brand baseline (BREAKING)

Removed the multi-axis brand machinery (`willink` / `clublink` / `fitai` brand axes). The token JSON now ships a single `i-willink` (vibrant violet) baseline. Consumers customize the brand color by overriding CSS variables on `:root` in their own globals.css. See `README.md` for the override pattern.

## [0.5.0] and earlier

Multi-axis brand era. `primitive.json` carried three brand color ramps and `semantic.json` aliased the active brand via the `[data-brand="…"]` attribute. Superseded by 0.8.0.
