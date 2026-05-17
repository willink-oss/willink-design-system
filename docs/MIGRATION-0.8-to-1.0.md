# Migration guide: 0.8.0 → 1.0.0

> Target audience: adopters of `@willink-labs/{tokens,tailwind-preset,react}` (or `willink_theme` on pub.dev) at any 0.8.x — 0.13.x version, upgrading to 1.0.0. This guide walks through every behavior change between `0.8.0` (single-brand baseline pivot) and `1.0.0` (API freeze).

## The 30-second version

- **No breaking exports.** Every component / hook / token type that was exported at 0.8.0 is still exported at 1.0.0 with the same name and the same prop signature.
- **One mechanical bump.** Update your `package.json` and run install. Most adopters will not need any code changes.
- **Five new opt-in additions** between 0.8.0 and 1.0.0 unlock smaller `:root` overrides and accessibility wins. Each is optional; the defaults keep the same visual feel.

```bash
# npm group (lockstep — all four packages move together)
pnpm add @willink-labs/tokens@^1.0.0 \
         @willink-labs/tailwind-preset@^1.0.0 \
         @willink-labs/react@^1.0.0 \
         @willink-labs/css-tokens@^1.0.0   # optional, new in 0.13.0

# Flutter (independent cadence)
flutter pub upgrade willink_theme  # ^1.0.0
```

## What changed since 0.8.0, in chronological order

### 0.9.0 — Semantic brand state tokens

Components that referenced primitive scale steps for hover / active state (Button `bg-brand-700`, Badge `bg-brand-100`, AlertDialog action) are now wired to new semantic state tokens:

- `--color-brand-hover` (default: `var(--color-brand-700)`)
- `--color-brand-active` (default: `var(--color-brand-800)`)
- `--color-brand-soft` (default: `var(--color-brand-100)`)
- `--color-brand-soft-fg` (default: `var(--color-brand-700)`)

**You need to update only if:** your consumer overrides `--color-brand` to a non-violet color and you want hover/active to follow your brand. Add the four state tokens to your `:root`:

```css
:root {
  --color-brand:          #2563eb;
  --color-brand-hover:    #1d4ed8;
  --color-brand-active:   #1e40af;
  --color-brand-soft:     #dbeafe;
  --color-brand-soft-fg:  #1d4ed8;
}
```

If you do not override these, Button hover and Badge default revert to the i-willink violet because components used to read the primitive scale directly. This was the ClubLink purple regression that prompted the change.

### 0.10.0 — Gradient utilities follow consumer overrides

`bg-gradient-{subtle,primary,ai}` / `text-gradient-primary` used to reference primitive scale steps. They now reference semantic tokens (`--color-brand`, `--color-brand-glow`, `--color-accent-cyan`, `--color-accent-pink`) and `--color-sky-50` as a fixed accent.

**Mostly transparent.** Consumers that override `--color-brand` see every gradient stop track their brand color automatically. The one change to call out:

- `bg-gradient-primary` used to be `violet → blue-600` (two-tone). It is now `var(--color-brand) → var(--color-brand-glow)` (monochromatic).

If you depended on the two-tone aesthetic, shadow the utility in your own globals:

```css
@layer utilities {
  .bg-gradient-primary {
    background-image: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
  }
}
```

### 0.11.0 — OKLCH-derived brand scale (BREAKING for consumer aliases)

Until 0.10.0 the entire `--color-brand-{50…950}` ramp was hard-coded violet. A consumer swapping to a different brand color had to alias **all 11 numeric steps** in their own `:root` to keep utilities like `text-brand-600` consistent.

0.11.0 derives the whole scale from a single `--color-brand` via `color-mix(in oklch, …)`. Adopters who were aliasing the ramp can now delete those lines:

```diff
 :root {
   --color-brand:       #2563eb;
-  --color-brand-50:    var(--color-blue-50);
-  --color-brand-100:   var(--color-blue-100);
-  --color-brand-200:   var(--color-blue-200);
-  --color-brand-300:   var(--color-blue-300);
-  --color-brand-400:   var(--color-blue-400);
-  --color-brand-500:   var(--color-blue-500);
-  --color-brand-600:   var(--color-blue-600);
-  --color-brand-700:   var(--color-blue-700);
-  --color-brand-800:   var(--color-blue-800);
-  --color-brand-900:   var(--color-blue-900);
-  --color-brand-950:   var(--color-blue-950);
 }
```

After 0.11.0 the 11 lines are unnecessary — the OKLCH derivation computes them from `--color-brand`.

Browser support note: `color-mix()` requires Chrome 111+ / Firefox 113+ / Safari 16.4+. If your consumer needs older browsers, either pin to `~0.10.x` (eight-month support window) or use `@willink-labs/css-tokens` (new in 0.13.0, ships static hex values).

### 0.12.0 — Role-based motion semantic tokens

A new semantic motion layer sits between primitives and component utilities:

```css
/* 0.12.0+ */
--duration-modal-enter:    var(--duration-fast);
--duration-popover-enter:  var(--duration-fast);
--duration-tooltip-enter:  var(--duration-fast);
--duration-sheet:          var(--duration-fast);
--duration-accordion:      var(--duration-base);
--duration-toast:          var(--duration-base);
--ease-enter:              var(--ease-standard);
--ease-exit:               var(--ease-standard);
--ease-emphasized-enter:   var(--ease-emphasized);
```

**Mostly transparent.** Existing components ride the new aliases; the alias chain resolves to the same primitive values as before. The one externally-visible change to call out:

- `Accordion` chevron rotation used hardcoded `duration-200` (200 ms). It now uses the semantic `duration-accordion` class which resolves to `--duration-base` = **250 ms** by default — a 50 ms increase. If you cannot accept the change, override:

  ```css
  :root { --duration-accordion: 200ms; }
  ```

Adopters that want a snappier feel can now retune one role without disturbing the global primitives:

```css
:root {
  --duration-accordion: 0ms;       /* instant accordion */
  --duration-modal-enter: 400ms;   /* slower modal entrance */
}
```

See [`docs/a11y/motion-contract.md`](./a11y/motion-contract.md) for the full table.

### 0.13.0 — `prefers-reduced-motion` contract + new css-tokens package

#### Reduced motion

Every animated DS component (Dialog, AlertDialog, Sheet, Accordion chevron + content, Tooltip) now honors the user's OS-level `prefers-reduced-motion: reduce` setting. The preset adds a CSS safety net that also collapses Sonner toast transitions. WCAG 2.3.3 closes for every DS-owned animation except `Skeleton`'s `animate-pulse` (flagged for follow-up).

**Adopter impact**: none, unless you were relying on motion to play regardless of the user's OS setting. If you need that override (rare and accessibility-hostile), you can re-enable inside `:root { @media not (prefers-reduced-motion: reduce) { … } }`.

#### `@willink-labs/css-tokens` (new package — optional)

Plain-CSS export of the DS tokens for consumers that cannot run Tailwind v4 (WordPress / Astro / Vue / Svelte / SolidJS / CDN snippets):

```bash
pnpm add @willink-labs/css-tokens@^1.0.0
```

```css
@import "@willink-labs/css-tokens/tokens.css";

:root { --color-brand: #2563eb; }
```

This package is **additive** — existing Tailwind-preset adopters do not need to install it. See [`packages/css-tokens/README.md`](../packages/css-tokens/README.md) and [ADR-0009](./adr/0009-css-tokens-package.md).

### 1.0.0 — API freeze

No new features land at 1.0.0. The release locks in the surface that the 0.9 → 0.13 cycle stabilized:

- 24 React components, all `cva` variant patterns and Radix integrations frozen
- 60 primitive + 25 semantic + 9 motion + 3 easing CSS variables
- 9 Material 3 widgets (Flutter)
- Lockstep across the four npm packages; Flutter floats per [ADR-0011](./adr/0011-flutter-independent-versioning.md)

Future minor versions follow strict [SemVer 2.0.0](https://semver.org/) per [ADR-0010](./adr/0010-semver-policy.md). Pin with `^1.0.0` for MINOR-safe upgrades.

## Flutter (`willink_theme`)

The Flutter package was at `0.5.0` for most of the 0.8.0 → 0.13.0 npm timeline. Between `flutter-v0.5.0` and `flutter-v1.0.0` there are no breaking changes — `1.0.0` is the API-freeze marker only (per [ADR-0011](./adr/0011-flutter-independent-versioning.md), the version coincidence with npm is a one-time storytelling decision, not a coupling commitment).

```bash
flutter pub upgrade willink_theme
```

After upgrade, run your widget tests; nothing public-facing should have changed.

## Validation checklist

Run these after upgrading to `^1.0.0`:

- [ ] `pnpm install` resolves without peerDependency warnings
- [ ] `pnpm typecheck` (or `tsc --noEmit`) passes
- [ ] Visual regression: open Dialog, AlertDialog, Accordion, Sheet, Tooltip in your app; confirm animations and reduced-motion behavior
- [ ] If you override `--color-brand`: open Button hover, Badge default, gradients; confirm brand color cascades correctly (you may need to add the 0.9.0 state tokens — see above)
- [ ] If you depend on `bg-gradient-primary` two-tone, decide whether to shadow the utility or accept the monochromatic look (see 0.10.0)
- [ ] If you use Accordion: accept the 50ms duration increase or override `--duration-accordion`
- [ ] Run your jest-axe / Lighthouse pass; the new `motion-reduce` contract should not regress anything

## Getting help

- Issue tracker: https://github.com/willink-oss/willink-design-system/issues
- ADRs: [`docs/adr/`](./adr/) — every architectural decision since 2026-05-08
- v1.0 release roadmap: [`docs/roadmap/v1.0.md`](./roadmap/v1.0.md)
