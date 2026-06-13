# ADR-0018: Gradient & accent text in dark mode — the audit blind spot, the dark-aware gradient fix, the extended audit

- **Status**: Accepted
- **Date**: 2026-06-13
- **Phase**: v1.8 cycle (dark polish — gradient text)

## Context

The dark contract ([ADR-0013](./0013-dark-mode.md)) holds for flat token roles: every surface flips, and since [ADR-0016](./0016-text-emphasis-roles.md) / [ADR-0017](./0017-dark-link-contrast-and-info-fg.md) so does emphasis and brand text. But it has had a hole that two CEO production reviews found and the automated audit did **not**:

> **The contrast audit cannot see `bg-clip-text text-transparent` gradient headings.**

`scripts/check-contrast.mjs` resolves flat `--color-*` token roles and checks pairs. A `text-gradient-primary` heading has `color: transparent` and paints its glyphs with a `linear-gradient` background clipped to the text box — its readable color is the **gradient's endpoints**, which the per-pair check never inspected. The i-willink.com production sweeps explicitly logged "bg-clip-text gradient headings (audit blind spot)". A second, related class the same reviews flagged: **accent text whose hue/lightness is too close to a gradient background** it sits on (the i-willink.com hero), which an endpoint-pair check also cannot reason about.

### The defect, in the DS's own utility

`text-gradient-primary` is `linear-gradient(135deg, brand 0%, brand-glow 100%)` clipped to text — i.e. `brand-600 → brand-500`, two **fixed brand primitives**. By [ADR-0013](./0013-dark-mode.md) the numeric brand ramp is mode-invariant: it does **not** flip. So on a dark page (`bg` = `neutral-950` = `#020617`) the clipped heading paints at brand-600/brand-500 — exactly the light-mode purple, now on near-black:

| `text-gradient-primary` worst endpoint vs `bg` | light (`#ffffff`) | dark (`#020617`) |
|---|---|---|
| **before** (brand → brand-glow, fixed) | brand-500 **4.23:1** | brand-600 **3.54:1 ✗ AA** |

The dark worst endpoint (brand-600, 3.54:1) is **below the WCAG 1.4.3 AA 4.5:1 floor** — the heading washes out into the dark background. This is the same root cause as #58 in [ADR-0017](./0017-dark-link-contrast-and-info-fg.md) (a fixed brand primitive used as foreground on a flipping surface), but here it is inside a *gradient* utility the audit was blind to. Even in light the worst endpoint (brand-500, 4.23:1) sits just under the 4.5 normal-text floor — fine for the *display* headings these are (it clears the 3:1 large-text floor) but a reminder the margin was always thin and ungated.

### bg-only gradients are not the bug

`bg-gradient-primary` (brand → brand-glow) and `bg-gradient-ai` (cyan → brand-glow → pink) sit **behind white text** as decorative section backgrounds. They are vivid by design; the relevant contrast is white-on-endpoint (governed by the `brand-fg`/surface intent), not a text-on-bg floor. They were assessed and **left as-is** — they are not text. The only DS utility that *is* text is `text-gradient-primary`.

## Decision

### 1. `text-gradient-primary` endpoints become dark-aware (light byte-identical)

Introduce two **preset-internal** variables — `--color-gradient-primary-from` / `--color-gradient-primary-to` — and point the utility at them. They follow the exact precedent of `--color-gradient-subtle-end` (1.2.0): preset-internal, intentionally **NOT** in `semantic.json` or `@willink-labs/css-tokens` (gradient utilities are a preset concern; css-tokens ships flat roles only), flipped via the ADR-0013 two-block mechanism.

| | light (from → to) | dark (from → to) |
|---|---|---|
| `--color-gradient-primary-*` | `brand` → `brand-glow` (= brand-600 → brand-500) | `brand-300` → `brand-400` |

- **Light is byte-identical.** The vars resolve to `brand` / `brand-glow` exactly as the literal endpoints did pre-1.7 — zero visual diff, zero risk to the light brand identity.
- **Dark brightens to lighter brand steps** so the clipped heading clears the floor while staying recognizably brand-purple. This is the *same move* `brand-soft-fg` already makes (brand-700 → brand-300 in dark, ADR-0017) — "a lighter brand step for legibility on dark" is an established DS pattern, not a new idea.

Result (worst endpoint vs `bg`, DTCG hex / preset OKLCH color-mix):

| `text-gradient-primary` worst endpoint | light | dark |
|---|---|---|
| **before** | brand-500 4.23 / 4.13 | brand-600 **3.54 ✗** |
| **after** | brand-500 4.23 / 4.13 *(unchanged)* | brand-400 **7.41 / 7.23 ✓ AAA-adjacent** |

Why `brand-300 → brand-400` and not the next-darker pair (`brand-400 → brand-500`, worst 4.76:1)? Both clear AA, but a fix that exists to *close a recurring defect* should not land one notch above the floor — `brand-400`'s 7.41:1 is a comfortable AAA-adjacent margin, and 300→400 preserves the gradient's lighter-to-darker *direction* (300 is the highlight "from", mirroring brand-600 being the "from" in light). Both endpoints stay clearly violet.

Per [ADR-0010](./0010-semver-policy.md), adding `@theme` variables (and the dark flips) is **MINOR** for `@willink-labs/tailwind-preset`. Light is unchanged; dark is a contrast *improvement*, compile-safe. A consumer who deliberately wants the fixed-brand gradient in dark can shadow the utility in their own `globals.css` (discouraged — it fails AA there).

### 2. Close the audit blind spot — a gradient-aware contrast check, frozen in CI

Extend `scripts/check-contrast.mjs` with a **`TEXT_GRADIENTS` registry**: each preset `@utility` that is clipped to text is declared with its endpoints **per mode** (exactly as `preset.css` resolves the `--color-gradient-*` vars). The check computes the **worst (lowest-contrast) endpoint** against `bg` and asserts:

- **dark — required ≥ 4.5** (FAIL → `exit 1`). The bug class is now frozen: any text-clipped gradient endpoint that washes out on the dark bg fails CI.
- **light — report-only baseline** (printed with ⚠, never fatal). The legacy fixed brand pair ships byte-identical; its worst endpoint clears the 3:1 large-text floor (these are display headings) but sits just under 4.5 — documented exactly like the feedback colors on white and the `fg-subtle`/`fg-faint` tiers, so the number is visible, not folklore.

Both the DTCG hex and the preset's OKLCH `color-mix` rendering are audited for each endpoint (reusing the existing brand-step machinery). The existing per-pair checks are unchanged. The gate is wired into CI through the same `packages/tokens/__tests__/contrast.test.ts` that already runs `pnpm -r test`.

**Demonstration it works:** reverting the dark endpoints to the pre-1.7 fixed brand pair (`brand-600 → brand-500`) turns the gate red — `text-gradient-primary` worst endpoint = `#7c3aed` on `#020617` = **3.54:1 ✗ FAIL**, `exit 1`. The exact defect the manual reviews caught is now caught by CI.

**Maintenance contract:** every new text-clipped gradient `@utility` added to `preset.css` must get a `TEXT_GRADIENTS` row. That is what keeps the blind spot closed.

### 3. The accent-on-gradient class — a documented consumer contract, not a DS token

The second flavor the reviews flagged (accent text whose hue is too close to a gradient *background*, e.g. the i-willink.com hero) is a **consumer composition** the DS cannot enumerate — it depends on which accent the consumer paints over which gradient. The DS does not place accent text on its own gradients (the only on-gradient text in the DS is white on the vivid bg-gradients, which is intentional and fine). So this is closed at the **guidance** level: a new [docs/a11y/gradient-and-accent.md](../a11y/gradient-and-accent.md) states the contract — *bg-clip gradient text and accent text on brand-gradient backgrounds must use dark-aware endpoints with sufficient hue/lightness separation; the audit now enforces this for DS utilities; consumers placing custom accent text on gradients must ensure the separation themselves (this was the i-willink.com hero blind spot)*. The DS fixes what it ships and tells consumers the rule for what they compose.

## Scope

| Area | What ships |
|---|---|
| `tailwind-preset` | `--color-gradient-primary-from` / `--color-gradient-primary-to` (preset-internal): light = `brand` / `brand-glow` (byte-identical), dark = `brand-300` / `brand-400` in **both** dark blocks (textually in sync per [ADR-0013](./0013-dark-mode.md)). `text-gradient-primary` re-pointed at the vars. `bg-gradient-primary` / `bg-gradient-ai` unchanged. **MINOR** ([ADR-0010](./0010-semver-policy.md): new `@theme` vars) |
| `tokens` / `css-tokens` / `react` | **No source change.** The gradient vars are preset-internal (like `--color-gradient-subtle-end`), not semantic.json roles, not css-tokens output, not referenced by any component. Lockstep-marker CHANGELOG entries only |
| Verification | `scripts/check-contrast.mjs` + `TEXT_GRADIENTS` registry: `text-gradient-primary` worst endpoint vs `bg`, required ≥ 4.5 in dark (7.41 / 7.23), report-only baseline in light (4.23 / 4.13). Wired into CI via the existing `contrast.test.ts` gate |
| Docs | this ADR; [v1.8 roadmap](../roadmap/v1.8.md); README roadmap line; new [a11y gradient/accent contract](../a11y/gradient-and-accent.md) + a cross-ref in [a11y matrix](../a11y/matrix.md) |

No `flutter-v*` tag (zero Flutter changes; [ADR-0011](./0011-flutter-independent-versioning.md) rejects content-free catch-up releases on the Flutter line). No semantic token surface grows; no new mechanism beyond two preset-internal vars on the existing two-block flip.

## Consequences

- DS-shipped gradient headings are now legible in dark (7.41:1 worst, up from 3.54:1) while light is byte-identical and the brand stays violet — the dark contract now holds for *gradient* text, not just flat roles.
- The **blind spot is closed and frozen**: bg-clip-text gradients are a first-class contrast-gate citizen; a regression on any text-clipped gradient endpoint fails CI, with a deliberately-bad-endpoint demonstration on record.
- Consumers get a written contract for the composition the DS can't enumerate (accent text on gradients), pointing at the exact i-willink.com hero failure mode so it can't recur silently across consumers.
- Light-mode gradient headings remain at 4.23:1 worst endpoint — a documented large-text baseline (≥ 3:1), not a regression; making light pass 4.5 would shift the light brand gradient and is explicitly out of scope (byte-identical light).

## Related

- [ADR-0013](./0013-dark-mode.md) — semantic-flip / primitive-invariant; the two-block mechanism the gradient vars flip through; `--color-gradient-subtle-end` precedent for a preset-internal flipping gradient var
- [ADR-0017](./0017-dark-link-contrast-and-info-fg.md) — the sibling fix (fixed brand foreground on a flipping surface, #58); this ADR closes the *gradient* instance of the same root cause and the audit gap behind it
- [ADR-0016](./0016-text-emphasis-roles.md) — per-role contrast policy; the report-only-baseline pattern reused here for the light gradient endpoint
- [ADR-0010](./0010-semver-policy.md) — new `@theme` variables = MINOR (preset)
- [ADR-0012](./0012-release-verification-policy.md) — Layer 2 release gate + the contrast gate (now gradient-aware) applied this cycle
- [v1.8 roadmap](../roadmap/v1.8.md) — this cycle
- [docs/a11y/gradient-and-accent.md](../a11y/gradient-and-accent.md) — the consumer contract for gradient/accent text
