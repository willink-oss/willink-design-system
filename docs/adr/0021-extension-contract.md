# ADR-0021: Extension contract — published `@theme` override surface, a named dark `@custom-variant`, and a CSS-first `@layer components`

- **Status**: Accepted
- **Date**: 2026-06-18
- **Phase**: v1.9 cycle (extensibility — Tailwind-like extension surface)

## Context

The real extension API of `@willink-labs/tailwind-preset` today is **implicit**: a consumer imports `preset.css`, re-declares `--color-brand` on `:root`, and the OKLCH `color-mix` scale (`--color-brand-50…950`) plus the state tokens (`-fg`/`-glow`/`-hover`/`-active`/`-soft`/`-soft-fg`) derive automatically ([README](../../README.md) "Customizing colors"). This is a great single-knob system — but nowhere is it written **which** tokens are safe to override versus which are derived internals that an override would break. A consumer who re-declares `--color-brand-600` (a derived ramp step) silently desynchronizes the scale.

Two more gaps:

- **The dark contract is duplicated, not published.** [ADR-0013](./0013-dark-mode.md) flips every semantic role in two near-identical blocks — `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` and `:root[data-theme="dark"] { … }`. The "keep them byte-identical" rule is prose, not a seam an extension author can target.
- **Non-React consumers have no styling target.** WordPress/Astro/Vue consumers get tokens but no component classes; they re-implement the cva strings by hand.

CEO direction (2026-06): make the system Tailwind-*extensible*. This ADR formalizes the extension contract. (Distribution — npm vs registry — is [ADR-0020](./0020-distribution-channels.md).)

## Decision

### 1. Publish the `@theme` override contract

| Tier | Tokens | Rule |
|---|---|---|
| **Override-safe (PUBLIC)** | `--color-brand` (the master knob), `--color-accent-cyan`, `--color-accent-pink`, `--shadow-glow`, motion (`--duration-fast/base/slow`, `--ease-standard/emphasized`) | Consumers MAY re-declare these on `:root`. Everything downstream derives. |
| **Derived / INTERNAL** | the brand ramp `--color-brand-50…950`, the brand state tokens (`-fg`/`-glow`/`-hover`/`-active`/`-soft`/`-soft-fg`), the gradient endpoints (`--color-gradient-subtle-end`, `--color-gradient-primary-from/-to`), the neutral ramps | Consumers MUST NOT override — they are computed from `--color-brand`. Overriding desyncs the scale. |

Override `--color-brand` and the entire system (scale, states, gradients, dark flips) follows. This is the published headline feature.

### 2. Name the dark contract as a `@custom-variant`

Expose the dark seam as a Tailwind v4 `@custom-variant dark` so the two flip blocks are one published, target-able variant rather than duplicated prose. Authors of new tokens/components reference the named variant; the byte-identical-blocks maintenance burden ([ADR-0013](./0013-dark-mode.md)) collapses to one seam. The `prefers-color-scheme` auto path and the explicit `[data-theme="dark"]` override path are both honored by the variant.

### 3. CSS-first `@layer components` (defer the JS `@plugin`)

Add an `@layer components` block of override-able DS classes (`.wl-btn` + `--outline`/`--ghost`, `.wl-card`, `.wl-input`) that mirror the cva strings. Tailwind v4 orders `components` below `utilities`, so consumers still override with atomics (`class="wl-btn rounded-none"`). This gives non-React consumers a real styling target and lets registry-copied source reference a class instead of re-vendoring atomics (shrinking the high-churn `safelist.css`). The implementation is a follow-up issue.

**Defer the JS `@plugin`** (`plugin.withOptions` / `addComponents`): v4 frames `@plugin` as a v3-compat path, and it reintroduces a build step into a package that proudly has none. Add it (as an optional `./plugin` export, never the spine) only if the safelist stays painful after the class layer lands.

## Consequences

- The override surface is documented, so consumers know the one knob (`--color-brand`) and the off-limits internals — fewer "my override broke the scale" defects.
- The dark contract becomes one published `@custom-variant` instead of two prose-synced blocks.
- Non-React consumers get `.wl-*` component classes; the preset keeps its no-build ethos (no JS plugin).
- Follow-ups: the `@layer components` implementation ([#97]); reconcile the README's stale `[data-brand]` prose with the single-`--color-brand`-override model.
