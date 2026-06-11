# ADR-0013: Dark mode — semantic flip on a `data-theme` contract

- **Status**: Accepted
- **Date**: 2026-06-11
- **Phase**: v1.2 cycle (dark mode core)

## Context

The preset has shipped a **partial** dark scaffold since 1.1.0: a `@media (prefers-color-scheme: dark)` block guarded by `:root:not([data-theme="light"])`, plus an explicit `:root[data-theme="dark"]` block — flipping only 4 roles (`bg` / `fg` / `muted` / `border`). It worked as a mechanism but was never formalized, and it left the rest of the system light-anchored:

- The other semantic roles didn't flip: brand state tokens (`brand-hover/active/soft/soft-fg`), feedback colors (`success/warning/danger`), shadows, and the `bg-gradient-subtle` stops (literal `#ffffff` and `sky-50`).
- The v1.2 survey found **18 primitive-utility leaks across 11 React components** (`bg-neutral-100/200`, `hover:bg-neutral-50/100`, Tooltip's `bg-neutral-900 text-neutral-50`, …) that freeze light-mode grays under a dark root. 15 are real bugs; the 3 `bg-black/50` overlays are intentional.
- The brand state tokens existed in `preset.css` (since 0.9.0) but **not** in `semantic.json` — a single-source-of-truth drift.
- `@willink-labs/css-tokens` had no dark export, so non-Tailwind consumers had no path to dark at all.
- Nothing verified contrast. Light-mode `success`/`warning` on white were already below 4.5:1 and nobody had a number for it.

## Decision

### 1. The `data-theme` contract (formalizing what 1.1.0 shipped)

Dark mode activates through exactly two paths, both already present in the 1.1.0 scaffold — this ADR freezes them as the public contract:

- **Auto**: `@media (prefers-color-scheme: dark)` flips the semantic roles unless the consumer opts out with `<html data-theme="light">`.
- **Explicit**: `<html data-theme="dark">` forces dark regardless of OS preference; `data-theme="light"` forces light.

We do **not** adopt a `.dark` class (the shadcn/Tailwind `darkMode: 'class'` convention). The attribute mechanism is already shipped, is valid-HTML self-documenting, leaves `class` untouched for consumer use, and gives a three-state model (`unset` / `dark` / `light`) that a boolean class cannot express. The preset keeps two textually identical declaration blocks (media-query path + attribute path); a comment in `preset.css` marks them as must-stay-in-sync.

### 2. Semantic-flip / primitive-invariant

Only **semantic roles** change between modes. Primitives — the entire neutral/blue/green/etc. scales and the **numeric brand scale including the OKLCH `color-mix` derivation block** — never move. The brand ramp stays light-anchored: `text-brand-600` renders the same violet under a dark root. A consumer who reaches past the semantic layer into numeric steps takes responsibility for dark-mode contrast themselves; DS components never reference numeric steps for surfaces after the React migration PR.

Invariant semantic roles (no dark value, by design): `ring`, `brand`, `brand-fg`, `brand-glow`, `accent-cyan`, `accent-pink`.

The dark palette (all values are existing primitives — none added):

| role | light | dark |
|---|---|---|
| `bg` | `#ffffff` | `neutral-950` |
| `fg` | `neutral-900` | `neutral-50` |
| `muted` | `neutral-500` | `neutral-400` |
| `border` | `neutral-200` | `neutral-800` |
| `surface-subtle` | `neutral-50` | `neutral-900` |
| `surface-muted` | `neutral-100` | `neutral-800` |
| `track` | `neutral-200` | `neutral-700` |
| `surface-inverted` | `neutral-900` | `neutral-100` |
| `surface-inverted-fg` | `neutral-50` | `neutral-900` |
| `brand-hover` | `brand-700` | `brand-500` |
| `brand-active` | `brand-800` | `brand-400` |
| `brand-soft` | `brand-100` | `brand-950` |
| `brand-soft-fg` | `brand-700` | `brand-300` |
| `success` | `green-600` | `green-500` |
| `warning` | `amber-600` | `amber-500` |
| `danger` | `red-600` | `red-500` |

Shadows flip at the preset level (`--shadow-soft` / `--shadow-md` get higher-alpha black; `--shadow-glow` is brand-tinted and stays). `bg-gradient-subtle` becomes fully theme-derived: `var(--color-bg) → brand-soft → var(--color-gradient-subtle-end)`, where `--color-gradient-subtle-end` is a **preset-internal** variable (light: `sky-50`, dark: `neutral-900`) — intentionally not a token in `semantic.json`, since it parameterizes one decorative utility rather than naming a reusable role.

In DTCG, dark values live on each flipping token as `"$extensions": { "willink.dark": { "$value": … } }` in `semantic.json` — per-token, so the schema stays a single file and invariant tokens are recognizable by the absence of the extension. This PR also heals the 0.9.0 drift by adding `brand-hover/active/soft/soft-fg` to `semantic.json` with their light aliases.

### 3. Five new surface roles

The 18-leak inventory clusters into exactly four consumption patterns, which become five roles (new `@theme` vars + Tailwind utilities + safelist entries):

| role | utility | absorbs |
|---|---|---|
| `surface-subtle` | `bg-surface-subtle` | outline Button hover (`hover:bg-neutral-50`) |
| `surface-muted` | `bg-surface-muted` | TabsList bg, Avatar fallback, ghost Button hover, menu item focus (`bg-neutral-100`, `focus:bg-neutral-100`) |
| `track` | `bg-track` | Switch off-track, Slider track, Progress track, Skeleton base (`bg-neutral-200`) |
| `surface-inverted` | `bg-surface-inverted` | Tooltip bg (`bg-neutral-900`) |
| `surface-inverted-fg` | `text-surface-inverted-fg` | Tooltip text (`text-neutral-50`) |

### 4. No Tailwind `dark:` variants

Components consume semantic utilities whose underlying CSS variables flip at `:root`. The flip happens in the cascade, not in the markup — so no component needs a `dark:` class, the markup stays mode-agnostic, and a consumer toggling `data-theme` at runtime re-themes everything without re-rendering. `dark:` variants in DS components would also break the explicit `data-theme="dark"`-under-light-OS path unless we reconfigured the variant selector — a complexity with zero benefit given the variable mechanism.

### 5. css-tokens dark export

`@willink-labs/css-tokens` gains a generated `tokens.dark.css` (exported as `./tokens.dark.css`) carrying both activation paths, built from the `willink.dark` extensions with the same alias→`var()` style as the light files. Non-Tailwind consumers import it after `tokens.css`. The dark *shadow* overrides are preset-level (shadows are primitives in DTCG and stay invariant in the token JSON); the css-tokens README documents how to copy them if wanted.

### 6. Contrast audit as a CI gate

`scripts/check-contrast.mjs` resolves the semantic palette in both modes from the token JSON and computes WCAG 2.1 relative-luminance ratios. Pairs touching numeric brand steps are audited twice: DTCG hex (css-tokens reality) and an OKLCH approximation of the preset's `color-mix` derivation. Required thresholds — `fg/bg ≥ 7`, `muted/bg`, `brand-fg/brand`, `brand-soft-fg/brand-soft`, `surface-inverted` pairs `≥ 4.5` (both modes), feedback-on-bg `≥ 4.5` (dark) — fail the script, and `packages/tokens/__tests__/contrast.test.ts` execs it inside `pnpm -r test`, so quality-gate enforces it forever. All required pairs pass at the palette above; no dark value needed adjustment.

**Documented baselines (report-only, printed with ⚠):**

- Light `success`/`warning` on white: **3.77:1 / 3.19:1** — pre-existing 1.x values; changing them is a MAJOR (ADR-0010) and out of this cycle's scope. Light `danger` passes (4.83:1).
- White on `danger` (AlertDialog destructive action): light **4.83:1** ✓; dark **3.76:1** — below 4.5:1 but above the 3:1 large-text/UI-component threshold; the destructive `Button` is the consumer. A `danger-fg` role remains the documented escape hatch if a future audit promotes this to required (per the v1.2 roadmap).

### Incidental

- `red-500` / `amber-500` are now mirrored into the preset's `@theme` feedback block (they already existed in `primitive.json`; the preset only carried the 600 steps) — required as `var()` targets for the dark feedback flip. MINOR per ADR-0010.
- The Skeleton `animate-pulse` reduced-motion debt (flagged in `docs/a11y/matrix.md` since 0.13.0) is closed in the same preset block touch: `.animate-pulse` joins the `prefers-reduced-motion` safety net.

## Out of scope

- **Per-component dark overrides** — components get exactly the semantic flip; no component ships dark-specific styles.
- **Dark-specific imagery / illustrations** — consumer concern.
- React leak migration, Storybook theme toggle, and Flutter `willinkDark()` land as separate follow-up PRs per the [v1.2 roadmap](../roadmap/v1.2.md) sequencing.

## Consequences

- Consumers on the Tailwind preset get full dark mode for free the moment the React migration lands — markup unchanged, one optional `data-theme` attribute for explicit control.
- `semantic.json` is again the single source of truth, now including mode: Flutter's `willinkDark()` and any future platform read the same `willink.dark` extensions instead of inventing a second palette.
- The token surface grows by 9 roles (MINOR); the `willink.dark` extension convention is additive and ignorable by DTCG tooling that doesn't know it.
- The contrast gate makes palette regressions a CI failure rather than a design-review catch — and makes the two light-mode feedback baselines visible numbers instead of folklore.
- Two preset blocks must stay textually identical by convention (comment-enforced). If that proves fragile, the follow-up is to generate `preset.css`'s dark block from the token JSON, not to drop the second path.

## Related

- [ADR-0010](./0010-semver-policy.md) — all changes here classify as MINOR (new keys / new variables / new utilities)
- [ADR-0012](./0012-release-verification-policy.md) — token-row verification applied to this PR
- [v1.2 roadmap](../roadmap/v1.2.md) — sequencing of the follow-up PRs
- [docs/a11y/matrix.md](../a11y/matrix.md) — Skeleton 2.3.3 row closed by this PR
