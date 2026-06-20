# Changelog

All notable changes to `@willink-labs/tailwind-preset` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.2.0` for exact-minor stability).

## [Unreleased]

### Fixed

- **safelist: close 14 purge-gap utilities** surfaced by the new `check-safelist-emission` gate (#125). Each is emitted from a shipped `@willink-labs/react` component but was absent from the safelist, so it purged in consumer builds that don't scan `node_modules` (the clublink.jp 5/8 failure mode): bare `outline-none` (Command / ContextMenu / DropdownMenu / HoverCard / Menubar / Popover / Select focus reset — distinct from the already-listed `focus-visible:outline-none`), `transition-opacity` (Dialog / Sheet overlay fade), `text-2xl` / `pt-0` / `transition-shadow` / `hover:shadow-md` (Card), `pb-4` (Accordion content), `peer-disabled:cursor-not-allowed` / `peer-disabled:opacity-70` / `ml-0.5` (Label), `px-2.5` (Badge), `p-2` (NavigationMenu), `min-h-20` / `resize-y` (Textarea). Several (Accordion `pb-4`, Label `ml-0.5`, NavigationMenu/Progress/Menubar structural classes) are emitted via raw `className="…"` rather than `cn()`, which the gate scans alongside `cn()`/`cva()`. Build-verified to emit in the playground consumer CSS.

## [1.8.0] — 2026-06-19

Lockstep with `@willink-labs/{tokens,css-tokens,react}@1.8.0` (the 14-component catalog expansion). The preset's own change is the CSS-first `@layer components` extension surface below, plus safelist entries for every class the new React components emit.

### Added — CSS-first `@layer components` DS classes (ADR-0021 §3, #97)

Override-able, framework-agnostic component classes that mirror the `@willink-labs/react` cva strings, so non-React consumers (WordPress / Astro / Vue) get a real styling target instead of re-vendoring atomics by hand:

- `.wl-btn` (+ `.wl-btn--outline` / `.wl-btn--ghost`) — mirrors `buttonVariants()` base + default variant + `md` size.
- `.wl-card` — mirrors `cardVariants()` default (`rounded-xl border border-border bg-bg text-fg transition-shadow`).
- `.wl-input` — mirrors the `Input` class string (incl. `placeholder`, `focus-visible` ring, `disabled`, and `aria-[invalid=true]` red border/ring).

Every declaration resolves a DS **semantic** token (`--color-brand` / `--color-brand-fg` / `--color-border` / `--color-bg` / `--color-fg` / `--color-surface-*` / `--radius-*`) — never a primitive ramp step, never a shadcn name — so a consumer's single `--color-brand` `:root` override carries through, and the dark flips apply with no `dark:` duplication. Emitted in `@layer components`, which Tailwind v4 orders **below** `utilities`, so consumers still override with atomics (`class="wl-btn rounded-none"`).

**No JS `@plugin` / build step** added — the preset keeps its no-build ethos (the JS plugin spine is deferred per [ADR-0021](../../docs/adr/0021-extension-contract.md) §3). The `.wl-*` classes are plain authored CSS and are **not** safelisted (only Tailwind utilities need `@source inline()`); see the note in `safelist.css`.

MINOR per [ADR-0010](../../docs/adr/0010-semver-policy.md) — additive, compile-safe, no existing utility or token changed.

### Changed

- Safelist extended with the class strings emitted by the 14 new `@willink-labs/react` components (the new components' utilities + arbitrary variants `[&>button]` / `[&_tr]` / `[&>svg]`), so they survive Tailwind purge in consumer builds.
- Added `homepage` + `bugs` metadata to `package.json`. (#80)

## [1.7.0] — 2026-06-13

### Added — dark-aware `text-gradient-primary` endpoints (ADR-0018)

The `text-gradient-primary` utility (`bg-clip-text` heading) painted its glyphs with the fixed `brand → brand-glow` gradient (brand-600 → brand-500). The numeric brand ramp does **not** flip ([ADR-0013](../../docs/adr/0013-dark-mode.md)), so on the dark page background (`bg` = neutral-950) the clipped heading rendered its worst endpoint at **brand-600 = 3.54:1 — below WCAG AA**, washing out. (Caught twice by manual production review; the contrast audit could not see `bg-clip-text` gradients — the blind spot [ADR-0018](../../docs/adr/0018-gradient-accent-text-dark.md) closes.)

- New **preset-internal** variables `--color-gradient-primary-from` / `--color-gradient-primary-to` (declared in `@theme` + **both** dark blocks, textually in sync per the [ADR-0013](../../docs/adr/0013-dark-mode.md) two-block convention; same kind of preset-internal flipping gradient var as `--color-gradient-subtle-end` since 1.2.0).
  - **light**: `brand` → `brand-glow` — **byte-identical** to the pre-1.7 gradient (worst endpoint brand-500 = 4.23:1, a documented large-text baseline).
  - **dark**: `brand-300` → `brand-400` — worst endpoint **7.41:1** on `bg` (AAA-adjacent), recognizably brand-purple. The same "lighter brand step in dark" move `brand-soft-fg` makes.
- `text-gradient-primary` re-pointed at the vars. `bg-gradient-primary` / `bg-gradient-ai` are **unchanged** — they are vivid section backgrounds behind white text, not clipped text.
- `prefers-reduced-motion` behavior is **unaffected** (color-only change; no keyframe or animation touched).

MINOR per [ADR-0010](../../docs/adr/0010-semver-policy.md) (new `@theme` variables; light byte-identical, dark a contrast improvement, compile-safe). A consumer who deliberately wants the fixed-brand gradient in dark can shadow the utility in their own `globals.css` (discouraged — it fails AA there). The repo-level `scripts/check-contrast.mjs` now gates every text-clipped gradient's worst endpoint against `bg` (required ≥ 4.5 dark / report-only baseline light), wired into CI via `packages/tokens/__tests__/contrast.test.ts`.

## [1.6.0] — 2026-06-13

### Lockstep bump (no preset change)

Pair with `@willink-labs/react@1.6.0` — the `Button variant="link"` dark-contrast fix ([ADR-0017](../../docs/adr/0017-dark-link-contrast-and-info-fg.md), #58). The fix re-points the link to the **existing** `text-brand-soft-fg` utility (and the Accordion-trigger hover to `text-brand-hover`); both `--color-brand-soft-fg` and `--color-brand-hover` already exist in `@theme` and both dark blocks, and `text-brand-soft-fg` / `hover:text-brand-hover` are already in the safelist — so no variable, utility, or safelist entry was added. `info-fg` was evaluated for upstreaming (#59) and **deferred** (rationale in ADR-0017). Published to keep the lockstep version set aligned per the monorepo convention.

## [1.5.0] — 2026-06-13

### Added — text emphasis utilities (`text-fg-*` ladder, ADR-0016)

Five new foreground CSS variables + safelist entries for the text-emphasis ladder upstreamed from the i-willink.com dark rollout ([ADR-0016](../../docs/adr/0016-text-emphasis-roles.md)) — sitting between `text-fg` and `text-muted`:

- `--color-fg-strong` (`neutral-800` / dark `neutral-100`), `--color-fg-emphasis` (`neutral-700` / `neutral-200`), `--color-fg-secondary` (`neutral-600` / `neutral-300`), `--color-fg-subtle` (`neutral-400` / `neutral-500`), `--color-fg-faint` (`neutral-300` / `neutral-600`) — declared in `@theme` (light) and in **both** dark blocks (`@media (prefers-color-scheme: dark)` + `:root[data-theme="dark"]`), kept textually in sync per the [ADR-0013](../../docs/adr/0013-dark-mode.md) two-block convention.
- Safelist: `@source inline("text-fg-strong")` … `text-fg-faint`, so the `text-fg-*` utilities compile for consumers that opt in.

No `dark:` variants needed — the roles flip through the underlying CSS variables. MINOR per [ADR-0010](../../docs/adr/0010-semver-policy.md) (new `@theme` variables + safelist entries).

## [1.4.1] — 2026-06-12

### Lockstep bump (no preset source change)

Pair with `@willink-labs/react@1.4.1` (PATCH: dist now ships the `'use client'` directive so RSC / Next.js App Router consumers can import from Server Components — production-discovered in the clublink-platform rollout). No source change in this package — published to keep the lockstep version set aligned per the monorepo convention.

## [1.4.0] — 2026-06-11

### Added — `text-danger` safelist entry (FormField error message)

`@source inline("text-danger")` — the new `FormFieldError` in `@willink-labs/react@1.4.0` ([ADR-0015](../../docs/adr/0015-formfield-api.md)) emits `text-sm text-danger` from the package dist, which consumer scanners never see (Tailwind v4 excludes `node_modules`). The compound's other class strings (`grid gap-2` / `text-sm text-muted`) were already safelisted. MINOR per [ADR-0010](../../docs/adr/0010-semver-policy.md) (new safelist entry).

## [1.3.0] — 2026-06-11

### Lockstep bump (no preset source change)

Pair with `@willink-labs/css-tokens@1.3.0` (WordPress / legacy-toolchain consumption fixes per [ADR-0014](../../docs/adr/0014-wordpress-consumption.md): root-level proxy CSS files for plain-path resolvers like postcss-import, plus the color-free `tokens.primitives.css` export). No source change in this package — published to keep the lockstep version set aligned per the monorepo convention.

## [1.2.0] — 2026-06-11

### Added — dark mode core (ADR-0013)

- **Full dark flip**: the two dark blocks (`@media (prefers-color-scheme: dark)` + `:root[data-theme="dark"]`, shipped partially since 1.1.0) now flip every flipping semantic role — `bg` / `fg` / `muted` / `border`, the new surface roles, `brand-hover/active/soft/soft-fg`, `success` / `warning` / `danger` — plus dark `--shadow-soft` / `--shadow-md` (higher-alpha black; `--shadow-glow` unchanged). The `data-theme` contract is formalized in [ADR-0013](../../docs/adr/0013-dark-mode.md): auto via OS preference, explicit override via `data-theme="dark"` / `"light"`; no `.dark` class, no `dark:` variants needed.
- **5 new semantic variables + utilities**: `--color-surface-subtle`, `--color-surface-muted`, `--color-track`, `--color-surface-inverted`, `--color-surface-inverted-fg` (with safelist entries `bg-surface-subtle`, `bg-surface-muted`, `bg-track`, `bg-surface-inverted`, `text-surface-inverted-fg` + hover/focus forms) — the targets for the React primitive-leak migration.
- **Theme-derived `bg-gradient-subtle`**: stops are now `var(--color-bg) → brand-soft → var(--color-gradient-subtle-end)` (preset-internal variable; light `sky-50` / dark `neutral-900`) instead of pinning literal `#ffffff` / `sky-50` under a dark root.
- **`red-500` / `amber-500` mirrored into `@theme`** from `primitive.json` (the preset previously carried only the 600 steps) — `var()` targets for the dark feedback flip.
- **Skeleton reduced-motion debt closed**: `.animate-pulse` (Tailwind built-in keyframe, not reachable by the DS-utility list) joins the `prefers-reduced-motion` safety net — flagged in `docs/a11y/matrix.md` since 0.13.0.

All additive — MINOR per [ADR-0010](../../docs/adr/0010-semver-policy.md).

### Changed — toast cancelButton safelist entry follows the React dark-mode migration

`@source inline("group-[.toast]:bg-neutral-100")` → `@source inline("group-[.toast]:bg-surface-muted")`. This class string flows through sonner's `toastOptions.classNames` at runtime — invisible to Tailwind's scanner — so the safelist entry must match what `@willink-labs/react` now emits. The entry's only consumer is the lockstep React `Toaster`; swapped rather than duplicated to keep the safelist authoritative.

## [1.1.0] — 2026-06-11

### Lockstep bump (no tailwind-preset source change)

Pair with `@willink-labs/react@1.1.0` (sonner 1.7.4 → 2.0.7 migration with a compat shim keeping the frozen Toaster surface, and a Slider single-thumb accessible-name fix). No source change in this package — published to keep the lockstep version set aligned per the monorepo convention.

## [1.0.0] — 2026-05-17

### API freeze (lockstep cut)

First stable release. The `@theme` CSS variable names, the `@utility` rule set, the `@source inline()` safelist entries, and the `preset.css` / `safelist.css` import paths are now part of the SemVer-2.0 contract. Renaming any of them is a MAJOR per [ADR-0010](../../docs/adr/0010-semver-policy.md).

No content change vs. 0.13.0; this is the lockstep marker that pairs with `@willink-labs/tokens@1.0.0`, `@willink-labs/react@1.0.0`, and `@willink-labs/css-tokens@1.0.0`. Adopter migration: [`docs/MIGRATION-0.8-to-1.0.md`](../../docs/MIGRATION-0.8-to-1.0.md).

## [0.13.0] — 2026-05-17

### Added — `prefers-reduced-motion` CSS safety net

A new `@media (prefers-reduced-motion: reduce)` block in `preset.css` collapses every DS keyframe utility (`.animate-fade-in/out`, `.animate-fade-up`, `.animate-dialog-in/out`, `.animate-sheet-in/out-{left,right,top,bottom}`, `.animate-accordion-down/up`) to `animation-duration: 0ms`. Sonner toast transitions (`[data-sonner-toaster] [data-sonner-toast]`) are also folded in via the same block since they are library-owned and not reachable via Tailwind variants.

This is **Layer 2** of the motion contract — Layer 1 is the `motion-reduce:animate-none` Tailwind variant added to each animated component in `@willink-labs/react@0.13.0`. Together they guarantee reduced-motion behavior even if a future component author forgets the Tailwind variant.

`Skeleton` (`animate-pulse`) is the one DS animation not covered by Layer 2 — it uses a Tailwind built-in keyframe, not a DS utility. Flagged for 0.14.0.

Reference: ADR-0008 (motion-contract), [`docs/a11y/motion-contract.md`](../../docs/a11y/motion-contract.md), [`docs/a11y/matrix.md`](../../docs/a11y/matrix.md).

## [0.12.0] — 2026-05-17

### Added — role-based motion semantic tokens

Introduce a new CSS-variable layer between motion primitives (`--duration-fast/base/slow`, `--ease-standard/emphasized`) and the `@utility animate-*` keyframe runners. The new aliases name each motion by **role**, so consumers can tune a single interaction without redefining the global primitives.

```css
/* primitives (unchanged) */
--duration-fast:  150ms;
--duration-base:  250ms;
--duration-slow:  400ms;
--ease-standard:    cubic-bezier(0.2, 0, 0, 1);
--ease-emphasized:  cubic-bezier(0.3, 0, 0, 1.1);

/* role-based aliases (new in 0.12.0) */
--duration-modal-enter:    var(--duration-fast);   /* Dialog / AlertDialog open */
--duration-modal-exit:     var(--duration-fast);   /* Dialog / AlertDialog close */
--duration-popover-enter:  var(--duration-fast);   /* DropdownMenu / Select overlay fade */
--duration-popover-exit:   var(--duration-fast);
--duration-tooltip-enter:  var(--duration-fast);
--duration-tooltip-exit:   var(--duration-fast);
--duration-sheet:          var(--duration-fast);   /* Sheet slide */
--duration-accordion:      var(--duration-base);   /* Accordion + chevron */
--duration-toast:          var(--duration-base);
--ease-enter:              var(--ease-standard);
--ease-exit:               var(--ease-standard);
--ease-emphasized-enter:   var(--ease-emphasized); /* hero CTA reveal */
```

`@utility animate-dialog-in/out`, `animate-fade-in/out`, `animate-sheet-in/out-*`, `animate-accordion-down/up`, and `animate-fade-up` all reference the new aliases instead of primitives. Tailwind v4 auto-generates `duration-accordion` / `duration-modal-enter` / … utility classes from each `--duration-*` declaration in `@theme`, so component code can opt in with familiar Tailwind syntax (`transition-transform duration-accordion`).

No behavior change: the alias chain resolves to the same primitive values. The added surface area is **override granularity** — a consumer can `--duration-accordion: 0ms` to disable that single interaction class without touching anything else.

`animate-fade-up` (hero reveal) is intentionally not bound to a semantic role yet — it remains `0.5s var(--ease-standard)`, and consumers wanting a `hero-reveal` semantic should open an issue for a future minor.

## [0.11.0] — 2026-05-17

### Changed — brand scale becomes OKLCH-derived from `--color-brand` (BREAKING)

Until 0.10.0 the entire `--color-brand-{50…950}` scale was hard-coded as the Tailwind violet palette. Consumers that swapped the brand color (e.g. ClubLink → blue) had to override **all 11 numeric steps** in their own `:root` to keep utilities like `text-brand-600` consistent. Missing even one step (which is easy — clublink-platform skipped 50/100/500/600/700) leaves those utilities rendering the original violet ([postmortem](#) — purple regression 2026-05-17).

0.11.0 derives the whole scale from a single `--color-brand` axis using `color-mix(in oklch, var(--color-brand) N%, white|black)`. Override `--color-brand` and the 11 numeric steps + all semantic state tokens follow automatically.

```css
/* Before (0.10.0) — consumer must alias all 11 steps */
:root {
  --color-brand:       #2563eb;
  --color-brand-50:    var(--color-blue-50);
  --color-brand-100:   var(--color-blue-100);
  /* …9 more lines… */
  --color-brand-950:   var(--color-blue-950);
  --color-brand-hover: #1d4ed8;
  --color-brand-soft:  #dbeafe;
  /* …semantic state overrides… */
}

/* After (0.11.0) — one line carries through every utility */
:root {
  --color-brand: #2563eb;
}
```

### Visual impact

- **i-willink baseline (no consumer override)**: the derived scale matches the prior Tailwind violet within ~1–2% per channel. Side-by-side the difference is imperceptible on solid fills; subtle on long gradients. We treat this as acceptable drift for a 0.x release rather than re-tuning ratios to pixel-match the legacy hex values, since the OKLCH ratios are easier to reason about for future tweaks.
- **clublink-platform**: after upgrading and removing the now-redundant 11-line alias block, every `text-brand-600` / `bg-brand-50` / `border-brand-300` etc. derives from `--color-brand: #2563eb` — same blue family the consumer was already overriding semantic tokens to.
- **Components**: no source change. Button / Badge / Card etc. continue to reference numeric or semantic brand tokens; the derivation is transparent to them.

### Browser support

`color-mix()` is supported in all evergreen browsers (Chromium 111+ / Safari 16.4+ / Firefox 113+, all 2023). Tailwind v4 additionally emits a static hex fallback wrapped in `@supports (color: color-mix(in lab, red, red))`, so legacy browsers fall back to the i-willink violet baseline — consumer brand override only takes effect on supporting browsers, but the page still renders.

### Migration

For consumers that overrode `--color-brand` (the only known case is clublink-platform):
1. Bump `@willink-labs/tailwind-preset`, `@willink-labs/react`, `@willink-labs/tokens` to `^0.11.0` (lockstep)
2. Delete the per-step alias block (`--color-brand-50: var(--color-blue-50);` … `--color-brand-950: var(--color-blue-950);`) — kept only `--color-brand: #2563eb` and any custom `--color-brand-glow` / `--color-brand-fg`
3. Optionally simplify the semantic state tokens (`--color-brand-hover` etc.) — they will derive correctly from `--color-brand-700` etc. without explicit override

### Lockstep bump
- `@willink-labs/tokens@0.11.0` (lockstep; `primitive.json` `brand` scale still references the i-willink hex values for Flutter codegen — runtime CSS uses the derived OKLCH scale, JSON tokens remain the i-willink reference)
- `@willink-labs/react@0.11.0` (lockstep, no source change)

## [0.10.0] — 2026-05-17

### Changed — gradient utilities migrate to semantic tokens

Lateral follow-up to 0.9.0: the gradient utilities (`bg-gradient-subtle` / `bg-gradient-primary` / `bg-gradient-ai` / `text-gradient-primary`) used to reference primitive scale values (`brand-50`, `brand-500`, `blue-600`) directly, so consumers that overrode `--color-brand` saw gradients that didn't match their brand. This release routes every gradient stop through semantic tokens.

| Utility | Before | After |
|---|---|---|
| `bg-gradient-subtle` | white → `brand-50` → `sky-50` | white → **`brand-soft`** → `sky-50` |
| `bg-gradient-primary` | `brand` → `blue-600` | `brand` → **`brand-glow`** (monochromatic) |
| `bg-gradient-ai` | `accent-cyan` → `brand-500` → `accent-pink` | `accent-cyan` → **`brand-glow`** → `accent-pink` |
| `text-gradient-primary` | same as bg-gradient-primary | same — also semantic now |

### Visual impact

- For the **willink baseline** (no consumer override): zero visual change. `brand-glow` default is `brand-500`, `brand-soft` default is `brand-100` — same hues as the prior primitive references.
- For consumers that **override `--color-brand`**: gradients now correctly inherit the brand color. ClubLink (#2563EB primary, #3B82F6 glow) sees its Hero gradient-subtle and gradient-primary tinted blue instead of violet.
- `bg-gradient-primary` shifts from "two-tone (brand → blue-600)" to "monochromatic (brand → brand-glow)". Consumers that depended on the prior willink-specific violet-to-blue look should shadow the utility in their own globals.css:

  ```css
  @layer utilities {
    .bg-gradient-primary {
      background-image: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
    }
  }
  ```

  (i-willink.com already does this and is unaffected.)

### Lockstep bump
- `@willink-labs/tokens@0.10.0` (lockstep, no source change)
- `@willink-labs/react@0.10.0` (lockstep, no source change)
- `willink_theme` (Flutter): no change — gradients are consumer-defined via `WillinkBrandTokens` extension, not embedded in widget code

## [0.9.0] — 2026-05-17

### Added — Brand state semantic tokens

To make `:root` brand overrides carry through every interaction state (not just the resting primary color), preset.css now exposes four new semantic tokens:

| Token | Default | Used by |
|---|---|---|
| `--color-brand-hover` | `var(--color-brand-700)` | Button default hover bg, Button link hover text, AlertDialog action hover |
| `--color-brand-active` | `var(--color-brand-800)` | Future :active state (currently unused, reserved) |
| `--color-brand-soft` | `var(--color-brand-100)` | Badge default variant bg |
| `--color-brand-soft-fg` | `var(--color-brand-700)` | Badge default variant fg |

### Changed — components migrated off primitive scale references

Components no longer reference `bg-brand-700` / `text-brand-700` / `bg-brand-100` / `shadow-brand-500/*` directly. They now use the semantic state tokens above, so a single `:root` override block in the consumer's globals.css fully retints every component (not just the resting state).

### Migration

Consumers that already override `--color-brand` must extend their `:root` block to include the new state tokens, otherwise Button hover / Badge default will revert to the baseline willink violet:

```css
:root {
  --color-brand:          #2563eb;
  --color-brand-glow:     #3b82f6;
  --color-brand-hover:    #1d4ed8;   /* NEW — hover state */
  --color-brand-active:   #1e40af;   /* NEW — reserved */
  --color-brand-soft:     #dbeafe;   /* NEW — Badge bg */
  --color-brand-soft-fg:  #1d4ed8;   /* NEW — Badge fg */
  --color-accent-cyan:    #10b981;
  --color-accent-pink:    #059669;
  --shadow-glow:          0 0 20px -5px rgba(37, 99, 235, 0.3);
}
```

### Lockstep bump
- `@willink-labs/tokens@0.9.0` (no source change — lockstep)
- `@willink-labs/react@0.9.0` (Button / AlertDialog / Badge updated to use semantic state tokens)
- `willink_theme@0.5.0` (Flutter — no change; Material 3 ColorScheme already handles state colors natively via `colorScheme.copyWith`)

## [0.8.0] — 2026-05-16

### Breaking — brand axis machinery removed

The `[data-brand="willink|clublink|fitai"]` switching mechanism has been removed in favor of direct `:root` CSS variable override. DS now ships a single willink baseline.

**Removed**:
- `[data-brand="willink"]` / `[data-brand="clublink"]` / `[data-brand="fitai"]` blocks in `preset.css`
- `brands/willink.css` / `brands/clublink.css` / `brands/fitai.css` force-mode files
- `BRANDS` const + `Brand` type from `index.ts`
- `exports['./brands/*.css']` from `package.json`

**Kept** (now hardcoded to willink values inside `@theme`):
- All semantic tokens (`--color-brand`, `--color-brand-glow`, `--color-accent-cyan`, etc.)
- All primitives (`--color-brand-50` through `--color-brand-950`, `--color-blue-*`, `--color-green-*`, neutrals, etc.)
- All gradient and animation utilities

### Migration

Replace `<html data-brand="clublink">` and similar attributes with a `:root` override in your consumer's globals.css:

```css
@import "@willink-labs/tailwind-preset/preset.css";

/* Old (0.7.x): <html data-brand="clublink"> ... </html> */
/* New (0.8.0): override CSS variables directly */
:root {
  --color-brand:       #2563eb;
  --color-brand-glow:  #3b82f6;
  --color-accent-cyan: #10b981;
  --color-accent-pink: #059669;
  --shadow-glow:       0 0 20px -5px rgba(37, 99, 235, 0.3);
}
```

If you imported `brands/*.css` directly, replace those imports with the inline `:root` block above.

### Why
1. ClubLink / fit-ai are independent products — bundling them as DS brand axes implied a managerial relationship that no longer reflects how the products evolve
2. Per-product axes in the preset created the wrong mental model: "register your brand in the DS before you can use a new color"; CSS variable override is the more standard OSS pattern
3. Removing the axis layer also simplifies the Flutter side (single `WillinkTheme.willink()` factory replaces 3 per-brand factories)

### Lockstep bump
- `@willink-labs/tokens@0.8.0` (also breaking: `BRANDS` / `BrandKey` / `BRAND_KEYS` removed; `./brand/*.json` subpaths removed)
- `@willink-labs/react@0.8.0` (lockstep — no source changes)
- `willink_theme@0.5.0` (Flutter — `WillinkBrand` enum and per-brand factories removed)

## [0.7.0] — 2026-05-14

### Added — Skeleton + Sheet components (2 new・23 total)

Skeleton (loading placeholder):
- variants: `rect` (default) / `circle` / `text`
- animate-pulse + bg-neutral-200

Sheet (side drawer・Radix Dialog ベース):
- side variants: `top` / `right` (default) / `bottom` / `left`
- compound exports: Sheet / SheetTrigger / SheetContent / SheetHeader / SheetTitle / SheetDescription / SheetFooter
- Dialog と同 motion token

CSS additions:
- `preset.css`: 8 `@keyframes` + 8 `@utility animate-sheet-{in,out}-{left,right,top,bottom}` (Sheet 用 slide)
- `safelist.css`: Skeleton (animate-pulse / bg-neutral-200 / rounded-{md,full}) + Sheet (fixed / inset-{x,y}-0 / w-3/4 / sm:max-w-sm / border-{t,b,l,r} / data-[state]:animate-sheet-*) を `@source inline()` で登録

採用想定: Skeleton 全 consumer (Loading state alternative) / Sheet mobile-first web (clubhouse 派生 web 等)。

### Lockstep version bump
- Bumped together with @willink-labs/react@0.7.0 and @willink-labs/tokens@0.7.0.

## [0.6.0] — 2026-05-13

### Changed — Brand axis single-source-of-truth 整理 (Issue #40)

`BRANDS` const export に `fitai` を追加し、3 brand 体制 (willink / clublink / fitai)
の TS / JSON / CSS / Flutter 4 層の整合性を完全 align:

- 修正前: `BRANDS = ["willink", "clublink"] as const` (tokens / CSS / Flutter には fitai があるのに TS export だけ漏れ)
- 修正後: `BRANDS = ["willink", "clublink", "fitai"] as const`

これは事実上 0.5.0 で完成すべき内容の追従修正。`Brand` type は
`"willink" | "clublink"` → `"willink" | "clublink" | "fitai"` に拡張 (additive
union expansion・既存 consumer の Brand value 比較は壊さない)。

### Single source of truth 契約 (新規明文化)

新規 brand 追加時の同期対象を `BRANDS` const 上のコメントに明文化:
1. `@willink-labs/tokens` (`tokens.brand.<brand>`)
2. `preset.css` (`[data-brand="<brand>"]` block)
3. `brands/<brand>.css` (force-brand CSS file)
4. Flutter `willink_theme` (`WillinkBrand.<brand>`)
5. `packages/tokens/src/brand/<brand>.json` (Design Tokens W3C)

### Lockstep version bump

- Bumped together with `@willink-labs/tokens@0.6.0` (no schema change・lockstep)
  and `@willink-labs/react@0.6.0` (no code change・lockstep)。

## [0.5.1] — 2026-05-13

### Fixed — Safelist coverage for Slider / Progress / Separator (Issue #38)

`safelist.css` の Slider / Progress / Separator セクションで以下のクラスが
未登録だったため、consumer 側 (Tailwind v4 が `node_modules` を default scan
しない構成) で **clublink.jp 5/8 P0 と同パターンの全崩れ** が発生する潜在的
リスクを解消:

- `h-full` — Slider Range (absolute) / Progress Indicator
- `h-6` — Separator デフォルト垂直サイズ
- `w-{2,6,12}` — 補助レイアウト
- `block` — Separator base orientation

### Audit notes

Issue #38 で指摘された安全側 (consumer 側 `safelist` 配布契約) に揃えるため、
slider / progress / separator の class を再 audit し `h-{px,1.5,2,4,6,full}`
+ `w-{px,2,4,6,12,full}` に拡張。playground production build で全 class
(`.h-full` / `.h-6` / `.block`) が CSS bundle に compile されることを確認済。

その他 component (Avatar / Tabs / Dialog / DropdownMenu / Tooltip 等)
の class は既存 safelist で網羅されており追加 fix なし。

## [0.5.0] — 2026-05-10

### Added — Slider + Progress + Separator 用 safelist

`safelist.css` に utility 系 component 用 utilities を inline 登録:
- size: `h-{px,1.5,2,4}` / `w-{px,4,full}`
- positioning: `relative` / `absolute` / `grow` / `flex-1`
- color: `bg-neutral-200` / `bg-border` / `border-brand`
- form: `touch-none` / `select-none` / `border-2`
- state: `transition-transform` / `data-[disabled]:opacity-50` / `disabled:pointer-events-none`

### Added — Avatar + Tabs + AlertDialog 用 safelist + Dialog scale keyframes

`preset.css` に Dialog scale keyframes を ship (AlertDialog でも共用):

```css
@keyframes willink-dialog-in / willink-dialog-out
@utility animate-dialog-in / animate-dialog-out
```

`safelist.css` に Avatar / Tabs / AlertDialog 用 utilities を inline 登録:
- Avatar: `relative` / `aspect-square` / `h-{4,5,8,10,12}` / `bg-neutral-100` / `font-medium`
- Tabs: `data-[state=active]:bg-bg` / `data-[state=active]:text-fg` / `data-[state=active]:shadow-soft` / `transition-all` / `mt-2`
- AlertDialog: Dialog と同様の positioning + dialog-in/out animations + `flex-col-reverse` / `sm:flex-row` / `sm:justify-end` / `hover:bg-brand-700` / `hover:bg-neutral-50`

### Added — Generic fade keyframes + DropdownMenu/Select safelist

`preset.css` に汎用 fade animation を追加 (DropdownMenu / Select / 将来の
Tooltip / Popover / Dialog overlay 等で共用):

### Added — Form controls 用 safelist (`@willink-labs/react@0.5.0` Switch + Checkbox + RadioGroup 用)

新 form control 3 種で使う Tailwind utilities を `safelist.css` に登録:

- size: `h-{3.5,4,5,6}` / `w-{3.5,4,5,11}` / `aspect-square`
- layout: `peer` / `grid` / `gap-2` / `pointer-events-none`
- transform: `transition-{colors,transform}` / `ring-0`
- Switch state-driven: `data-[state=checked]:translate-x-5` / `data-[state=unchecked]:translate-x-0` / `data-[state=checked]:bg-brand` / `data-[state=unchecked]:bg-neutral-200`
- Checkbox state-driven: `data-[state=checked]:text-brand-fg` / `data-[state=checked]:border-brand`
- disabled / indicator: `disabled:cursor-not-allowed` / `fill-current` / `text-current`
- radius: `rounded-sm` (Checkbox) / `rounded-full` (Switch + RadioGroupItem)

### Added — `animate-fade-in` / `animate-fade-out` 汎用 utility + 関連 safelist

`@willink-labs/react` の Tooltip / Dialog overlay / 将来 Popover 等で共用する
generic fade utility を `preset.css` に ship。 `--duration-fast` (150ms) +
`--ease-standard` で構成し、ブランドモーション統一。

```css
@keyframes willink-fade-in / willink-fade-out
@utility animate-fade-in / animate-fade-out
```

`safelist.css` に DropdownMenu / Select 用 utilities を inline 登録:
- size: `min-w-32` / `max-h-96` / `min-w-[var(--radix-select-trigger-width)]` /
  `h-[var(--radix-select-trigger-height)]` / `h-{px,3.5,4,10}` / `w-{3.5,4,full}`
- spacing: `p-1` / `py-{1.5,2}` / `px-{2,3}` / `pl-8` / `pr-2` / `ml-auto` /
  `-mx-1` / `my-1`
- positioning: `relative` / `absolute` / `left-2` / `z-50`
- typography: `text-{xs,sm}` / `font-semibold` / `tracking-widest`
- state-driven: `data-[state={open,closed}]:animate-fade-{in,out}` /
  `data-[side=bottom]:translate-y-1` / `data-[side=top]:-translate-y-1` /
  `data-[disabled]:pointer-events-none` / `data-[disabled]:opacity-50`
- focus: `focus:bg-neutral-100` / `focus:text-fg`
- 他: `select-none` / `placeholder:text-muted` / `opacity-70`

`safelist.css` に以下を追加 (Tooltip / Toast 用):
- `bg-neutral-{50,100,900}` / `text-neutral-50`
- `text-xs` / `px-3` / `py-1.5` / `rounded-md` / `shadow-md`
- `data-[state=delayed-open]:animate-fade-in` / `data-[state=closed]:animate-fade-out`
- `group-[.toaster]:bg-bg` 等 Sonner Toast の group selector pattern (8 entries)

### Added — Dialog animation utilities + safelist (`@willink-labs/react@0.5.0` Dialog 用)

`preset.css` に Dialog 用 keyframes + utilities を ship:

- `@keyframes willink-fade-in/out` (overlay backdrop fade)
- `@keyframes willink-dialog-in/out` (content scale + translate-50% 補正)
- `@utility animate-fade-in` / `animate-fade-out`
- `@utility animate-dialog-in` / `animate-dialog-out`

すべて DS motion token (`--duration-fast` 150ms / `--ease-standard`) を
使用し、ブランドモーション統一感を維持。Accordion keyframes (0.4.1) と
同じパターン (consumer 側 workaround を不要化)。

`safelist.css` に Dialog 用 layout / state-driven utilities を追加:

- positioning: `fixed` / `inset-0` / `z-50` / `bg-black/50` / `left-[50%]`
  / `top-[50%]` / `translate-x-[-50%]` / `translate-y-[-50%]`
- size variants: `max-w-{sm,md,lg,2xl}` / `max-w-[95vw]`
- close button: `absolute` / `right-4` / `top-4` / `rounded-sm` / `opacity-{70,100}`
- state-driven animations: `data-[state={open,closed}]:animate-{fade,dialog}-{in,out}`
- header/footer: `flex-col` / `flex-col-reverse` / `space-y-1.5` / `space-x-2` /
  `sm:flex-row` / `sm:justify-end` / `sm:text-left`

### Added — fit-ai brand axis (3rd brand on React/CSS side)

`[data-brand="fitai"]` ブロックを `preset.css` に追加し、fit-ai を React 側
3 番目のブランド軸として正規化。Flutter `WillinkBrand.fitai` (5/8 Phase 5.3
で確立) と完全 mirror。

- `--color-brand`: `#3b82f6` (blue-500・fitaiPrimary)
- `--color-brand-fg`: `#ffffff`
- `--color-brand-glow`: `#60a5fa` (blue-400)
- `--color-accent-cyan`: `#5cdca8` (fit-ai 独自 emerald・shared palette には無し)
- `--color-accent-pink`: `#8b5cf6` (brand-500 violet・cross-brand AI accent)
- `--shadow-glow`: blue-500 30% glow

新規 export:
- `@willink-labs/tailwind-preset/brands/fitai.css` (single-brand lock 用)
- `@willink-labs/tokens/brand/fitai.json` (codegen / TypeScript 値 import 用)

### Why now

- fit-ai (中核 SaaS) は Flutter 側で `WillinkBrand.fitai` が 5/8 既に稼働
- React/CSS 側未実装が 5/10 i-willink-crew DS 続行検討で gap として顕在化
- fit-ai 将来 Web 化 (admin / internal tool / staging dashboard 等) 時に
  brand axis があれば即座に DS 適用可能
- 「Flutter は揃ってるが React は揃ってない」二重メンテ状態を解消

### Lockstep version bump

- Bumped together with `@willink-labs/tokens@0.5.0` (`brand/fitai.json` 新規)
  and `@willink-labs/react@0.5.0` (code 変更なし・lockstep)。

### Added — safelist で AccordionItem variant + Trigger group/trigger を保証 (Issue #27 P1+P2)

`@willink-labs/react@0.5.0` で `AccordionItem` に variant prop (flat/card/bordered)・
`AccordionTrigger` に `group/trigger` named group + icon prop が追加。これに
伴い consumer の Tailwind v4 が node_modules を非スキャンの状況でも以下の
class が compile されるよう `safelist.css` に inline 登録:

- AccordionItem variant 用: `rounded-{md,xl}` / `shadow-{soft,md}` / `data-[state=open]:shadow-md` / `mb-{2,3}` / `last:mb-0` / `bg-bg`
- AccordionTrigger group: `group/trigger` / `group-data-[state=open]/trigger:rotate-180` / `group-data-[state=open]/trigger:hidden` / `group-data-[state=open]/trigger:block`

### Lockstep version bump
- Bumped together with `@willink-labs/tokens@0.5.0` and `@willink-labs/react@0.5.0`.







## [0.4.1] — 2026-05-10

### Fixed — Accordion アニメーションが consumer 側で動作しない問題 (Issue #27 P0)
- `@willink-labs/react` の `AccordionContent` は `data-[state=open]:animate-accordion-down`
  / `data-[state=closed]:animate-accordion-up` を emit していたが、`preset.css`
  に該当の `@keyframes` および `@utility` 定義を ship していなかったため、consumer
  全員でアコーディオン展開/折りたたみが瞬時切替になっていた。
- Fix:
  - `@keyframes accordion-down` / `accordion-up` を Radix の
    `--radix-accordion-content-height` 連動で追加。
  - `@utility animate-accordion-down` / `animate-accordion-up` を DS の motion
    token (`--duration-base` / `--ease-standard`) で構成。consumer 側のブランド
    モーション統一感を維持。
  - `safelist.css` に `data-[state={open,closed}]:animate-accordion-{down,up}`
    の `@source inline()` を追加し、Tailwind v4 の node_modules 非スキャン
    制約下でも consumer の CSS bundle に正しく compile されるよう保証。
- 影響: `clublink-platform` (Phase 3 で flat list のため気付かれず)、`i-willink.com`
  (将来 DS 適用時)。consumer 側 workaround を 0.4.1 採用後に削除可能。

## [0.4.0] — 2026-05-08

### Added — `@source` is now automatic
- New `safelist.css` (auto-imported from `preset.css`) lists every DS
  component class via Tailwind v4's `@source inline()` directive. Because
  `@source inline()` takes class names rather than filesystem paths, the
  registration is portable across pnpm symlinks, npm tarballs, and
  Turborepo hoisting — the precise failure mode that caused the 5/8 P0
  regression on clublink.jp.
- `safelist.css` is also exposed via `package.json` `exports` so consumers
  can import it directly if they ever need the safelist without the rest
  of the preset.

### Changed — consumer setup is now one line
- `README` Quick Start: removed the two `@source ".../node_modules/..."`
  lines. The only required entry in the consumer's CSS is now:
  ```css
  @import "@willink-labs/tailwind-preset/preset.css";
  ```
- `preset.css` opening comment rewritten to reflect the one-line setup
  and to point at `safelist.css` for the maintenance contract.

### Backwards compatible
- Consumers that still have the legacy `@source` lines from 0.3.x will
  continue to build successfully — Tailwind treats duplicate registrations
  as idempotent. We will remove those lines from clublink-platform and
  i-willink.com in follow-up consumer PRs.

### Why this approach (not a JS plugin)
- The 0.3.0 changelog promised a "Tailwind v4 plugin that registers content
  paths via the JS plugin API". Tailwind v4's documented plugin surface
  does not expose programmatic content-path registration; the `@plugin`
  directive only loads legacy v3-style plugins. `@source inline()` (a CSS
  directive) is the v4-native mechanism for forcing class compilation, and
  it solves the path-portability problem that blocked the 0.3.0-rc embed.

### Lockstep version bump
- Bumped together with `@willink-labs/tokens@0.4.0` and `@willink-labs/react@0.4.0`
  to keep the three DS packages versioned as a single unit.

## [0.3.0] — 2026-05-08

### Documentation
- **Setup is now documented**. Consumers must add two `@source` lines next
  to their `@import` of `preset.css` so Tailwind v4 will scan the DS
  React-component built sources for cva-emitted classes. See README
  "Required @source setup" — without these lines, components render
  with no brand colors / shadows / borders in production. This caused
  a P0 regression on clublink.jp on 2026-05-08 (hotfixed same day in
  clublink-platform PR #19).

### Why this is documentation, not a code fix
A code-side fix attempted to embed the `@source` lines inside `preset.css`
itself (so consumers would only need the single `@import`), but the
relative-path resolution semantics are not portable across pnpm symlinks
and published npm tarballs. The fragile embed was reverted before publish.
A proper fix will land in `0.4.0` as a Tailwind v4 plugin that registers
content paths through the JS plugin API.

### Lockstep version bump
Bumped together with `@willink-labs/tokens@0.3.0` and `@willink-labs/react@0.3.0`
to keep the three DS packages versioned as a single unit.

## [0.2.7] — 2026-05-08

Initial public release on npmjs.org via OIDC Trusted Publisher. No CSS changes
versus 0.2.0 — the version bumps from 0.2.0 → 0.2.7 were all about getting the
publish pipeline working (GitHub Packages → npmjs.org → OIDC). See
`docs/adr/0006-npmjs-migration.md` and `docs/adr/0007-oidc-trusted-publisher.md`
for the full journey.

## [0.2.0] — 2026-05-07

### Added
- Initial token + brand-axis preset (i-willink default + clublink alt brand)
- `@theme` block exposing `--color-{neutral,brand,success,warning,danger}-*`
  primitives plus semantic aliases (`--color-bg`, `--color-fg`, `--color-border`,
  `--color-muted`, `--color-ring`).
- `[data-brand="willink"]` / `[data-brand="clublink"]` switching block.
