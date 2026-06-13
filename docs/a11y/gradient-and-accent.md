# Accessibility — Gradient & accent text contract (dark mode)

> Added 1.7.0 ([ADR-0018](../adr/0018-gradient-accent-text-dark.md)). Companion to the [WCAG matrix](./matrix.md). Covers the one class the per-pair contrast audit historically could not see: **text whose color comes from a gradient** (`bg-clip-text`) and **accent text placed on a gradient background**.

## Why this exists

`scripts/check-contrast.mjs` resolves flat `--color-*` token roles and checks foreground/background pairs. Two things slip past a flat-role check:

1. **`bg-clip-text text-transparent` gradient headings.** The glyphs are painted by a `linear-gradient`, so the readable color is the gradient's *endpoints*, not a single token. A heading can therefore wash out on a dark background while the audit reports green. The i-willink.com production sweeps explicitly logged this as "bg-clip-text gradient headings (audit blind spot)" — caught twice by manual review, missed by CI.
2. **Accent text on a gradient background.** When a consumer paints accent-colored text over a brand-gradient panel, legibility depends on hue *and* lightness separation between the accent and the gradient underneath it — not on any single token pair. This was the i-willink.com hero blind spot.

## The contract

### For DS-shipped gradient text — enforced by the audit (1.7.0+)

- **`bg-clip-text` gradient text must use dark-aware endpoints.** The DS's `text-gradient-primary` utility resolves its endpoints through preset-internal `--color-gradient-primary-from` / `--color-gradient-primary-to`, which flip in dark (light `brand` → `brand-glow`; dark `brand-300` → `brand-400`) so the clipped heading clears the contrast floor on the dark `bg`. See [ADR-0018](../adr/0018-gradient-accent-text-dark.md).
- **The contrast gate now covers it.** `scripts/check-contrast.mjs` carries a `TEXT_GRADIENTS` registry: every text-clipped gradient `@utility` is declared with its endpoints per mode, and the gate asserts the **worst (lowest-contrast) endpoint** against `bg`:
  - **dark — required ≥ 4.5** (WCAG 1.4.3 AA normal-text floor). FAIL → CI red. `text-gradient-primary` lands **7.41:1** worst (was 3.54:1 before the fix).
  - **light — report-only baseline.** The legacy fixed brand pair ships byte-identical; its worst endpoint is **4.23:1** — above the 3:1 large-text floor (these are display headings) but just under 4.5, documented exactly like the feedback colors on white and the `fg-subtle`/`fg-faint` tiers. Printed with ⚠, never fatal.
- **Maintenance rule:** any new text-clipped gradient `@utility` added to `preset.css` must get a `TEXT_GRADIENTS` row, or the blind spot reopens for that utility.

> Vivid **background** gradients (`bg-gradient-primary`, `bg-gradient-ai`) are *not* text — they are decorative section backgrounds sitting behind white text, intentionally saturated. They are deliberately **not** in the registry; their legibility is governed by white-on-endpoint / design intent, not the text floor. See [ADR-0018](../adr/0018-gradient-accent-text-dark.md).

### For consumers — what the DS cannot enforce, but you must hold

- **Accent text on a brand-gradient background needs hue *and* lightness separation in both modes.** A purple accent on a violet gradient, or a cyan accent on a cyan→pink gradient, can fail even when each color passes against a flat `bg`. The audit cannot enumerate which accent you paint over which gradient — that is your composition. Verify it the same way the DS verifies its own: worst-case endpoint of the gradient under the text vs the text color, in **both** light and dark. (This was the i-willink.com hero failure mode.)
- **Custom `bg-clip-text` gradients must themselves use dark-aware endpoints.** If you shadow `text-gradient-primary` or define your own clipped-text gradient, give it endpoints that flip (or are light enough) for the dark background — fixed brand primitives wash out on dark, exactly like the DS defect ADR-0018 fixed.
- **Prefer the DS roles when you can.** A non-gradient emphasized heading should use a flipping role (`text-fg-strong` / `text-fg-emphasis` / `text-brand-soft-fg`), all of which pass AA/AAA in both modes by contract — no per-composition contrast math needed.

## Reference numbers (`text-gradient-primary` worst endpoint vs `bg`)

| | light (`#ffffff`) | dark (`#020617`) |
|---|---|---|
| **before** (fixed `brand` → `brand-glow`) | brand-500 4.23:1 | brand-600 **3.54:1 ✗ AA** |
| **after** (dark-aware: light unchanged, dark `brand-300` → `brand-400`) | brand-500 4.23:1 *(unchanged)* | brand-400 **7.41:1 ✓** |

(Preset OKLCH `color-mix` rendering: 4.13:1 light / 7.23:1 dark — both audited alongside the DTCG hex.)
