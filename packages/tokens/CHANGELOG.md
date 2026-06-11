# Changelog

All notable changes to `@willink-labs/tokens` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.12.0` for exact-minor stability). The npm packages
in this monorepo (`@willink-labs/tokens`, `@willink-labs/tailwind-preset`,
`@willink-labs/react`) move in lockstep — every release bumps all three to the
same minor.

## [1.2.0] — 2026-06-11

### Added — dark mode core (ADR-0013)

- **Dark values via DTCG `$extensions`**: every flipping semantic color role now carries `"$extensions": { "willink.dark": { "$value": … } }` — the value the role resolves to under `data-theme="dark"` / `prefers-color-scheme: dark`. 16 roles flip (`bg`, `fg`, `muted`, `border`, the 5 new surface roles, the 4 brand state tokens, `success`, `warning`, `danger`); tokens without the extension (`ring`, `brand`, `brand-fg`, `brand-glow`, `accent-cyan`, `accent-pink`) are mode-invariant by design. Primitives never flip.
- **5 new surface roles** absorbing the primitive-utility leaks found in the v1.2 survey: `color.surface-subtle` (outline Button hover), `color.surface-muted` (TabsList / Avatar fallback / ghost hover / menu item focus), `color.track` (Switch / Slider / Progress / Skeleton), `color.surface-inverted` / `color.surface-inverted-fg` (Tooltip).
- **Brand state tokens** `color.brand-hover` / `brand-active` / `brand-soft` / `brand-soft-fg` added to `semantic.json` with their light aliases (`{color.brand.700}` etc.) — healing the 0.9.0 drift where they existed only as preset CSS variables.
- **Contrast audit CI gate**: `__tests__/contrast.test.ts` executes the repo-level `scripts/check-contrast.mjs` (WCAG 2.1 ratios for the key pairs in both modes) and fails on any required pair below threshold. All required pairs pass; light-mode `success`/`warning` on white (3.77 / 3.19) and dark white-on-danger (3.76) are documented report-only baselines — see ADR-0013.

All additive — MINOR per [ADR-0010](../../docs/adr/0010-semver-policy.md).

## [1.1.0] — 2026-06-11

### Lockstep bump (no tokens source change)

Pair with `@willink-labs/react@1.1.0` (sonner 1.7.4 → 2.0.7 migration with a compat shim keeping the frozen Toaster surface, and a Slider single-thumb accessible-name fix). No source change in this package — published to keep the lockstep version set aligned per the monorepo convention.

## [1.0.0] — 2026-05-17

### API freeze (lockstep cut)

First stable release. Token JSON shape and key set are frozen — every key documented in `primitive.json` and `semantic.json` at 1.0.0 is part of the public contract. Future MINOR releases may add new keys; renaming or removing a key, or changing the value an alias resolves to, is a MAJOR (see [ADR-0010](../../docs/adr/0010-semver-policy.md)).

No content change vs. 0.13.0. The version bump exists to align the four npm packages (`tokens` / `tailwind-preset` / `react` / `css-tokens`) at a single "1.0" cut and to start the SemVer-2.0 contract clock. Adopter migration: [`docs/MIGRATION-0.8-to-1.0.md`](../../docs/MIGRATION-0.8-to-1.0.md).

`willink_theme` (pub.dev) bumps to `1.0.0` in the same PR as a one-time storytelling coincidence; from `1.0.1` onward Flutter floats per [ADR-0011](../../docs/adr/0011-flutter-independent-versioning.md).

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
