# ADR-0017: Dark-mode link contrast (Button `link` / Accordion hover) + the `info-fg` upstreaming verdict

- **Status**: Accepted
- **Date**: 2026-06-13
- **Phase**: v1.7 cycle (dark polish)

## Context

Two issues opened against the dark-mode contract drive this cycle. Both are about brand-colored **text** and both turn on the same [ADR-0013](./0013-dark-mode.md) principle: **only semantic roles flip between modes; primitives (the numeric brand scale included) are mode-invariant.**

### #58 — `Button variant="link"` fails AA in dark

The `link` cva variant resting color was `text-brand` — i.e. `--color-brand`, which is the fixed `brand-600` primitive (`#7c3aed`). `brand-600` does **not** flip ([ADR-0013](./0013-dark-mode.md): the numeric brand ramp is light-anchored). On the dark page background (`bg` = `neutral-950` = `#020617`), a resting link rendered at **3.54:1 — below the WCAG 1.4.3 AA 4.5:1 floor for normal text.** In light it was 5.70:1 (fine). The i-willink.com production sweep on `/design-system` reproduced it.

The hover (`hover:text-brand-hover`) was already correct: `brand-hover` is a *flipping* role (light `brand-700` / dark `brand-500`).

This is a **class** of bug — "a fixed brand foreground on a surface that flips" — so it needed a DS-wide audit, not just a Button patch.

### #59 — should the DS adopt an `info-fg` (blue) text role?

i-willink.com added a **local** `--color-info-fg` (light `blue-600` / dark `blue-400`, dual-block flip) during its dark rollout, because the DS has no blue/"info" text role — only `success`/`warning`/`danger` exist as feedback colors. The question: upstream it, or leave it local?

## Decision

### 1. Button `link` resting → `text-brand-soft-fg` (a flipping role)

Change the `link` variant resting foreground from `text-brand` to **`text-brand-soft-fg`**. `brand-soft-fg` flips by contract (light `brand-700` / dark `brand-300`).

| | light resting | dark resting |
|---|---|---|
| **before** (`text-brand` = brand-600, invariant) | 5.70:1 | **3.54:1 ✗ AA** |
| **after** (`text-brand-soft-fg`: brand-700 → brand-300) | **7.10:1** (preset color-mix 7.90) | **10.93:1** (preset 10.80) |

Both modes now clear AAA. Hover is left as `text-brand-hover` — verified legible in dark (`brand-500` on `bg` = **4.76:1**, AA; preset color-mix 4.88).

#### Why this option over a new dedicated link role (the considered alternative)

The brief offered two fixes; both were evaluated against (a) passes contrast in both modes and (b) minimizes light-mode change:

| Option | light resting | dark resting | light shift vs brand-600 | new mechanism |
|---|---|---|---|---|
| **A. reuse `text-brand-soft-fg`** (chosen) | 7.10 ✓ | 10.93 ✓ | brand-600 → brand-700 (subtly darker purple) | **none** — existing role, already in preset + safelist + css-tokens |
| B. new dedicated `link-text` role (brand-600 light / brand-300 dark) | 5.70 ✓ | 10.93 ✓ | **zero** | new semantic token + 3 preset decls (light + 2 dark blocks) + css-tokens regen + safelist entry |

Option B wins on criterion (b) — literally zero light-mode shift — but only by **adding a new semantic role and its full mechanism** to fix a single component's single state. Option A wins decisively on every other axis:

- **DS minimalism / ADR-0013 intent.** A text link *is* brand-emphasized text on a surface; `brand-soft-fg` is exactly "brand foreground that flips for legibility" — the role already exists for precisely this job (it's the Badge-soft fg). Reusing it is the on-grain choice; minting `link-text` would be a second role with the same purpose.
- **The light shift is benign and arguably an improvement.** brand-600 → brand-700 is one ramp step darker (`#7c3aed` → `#6d28d9`), and it *raises* light contrast 5.70 → 7.10. It is not a regression, just a slightly deeper purple on the resting link.
- **Zero new surface to verify, safelist, regen, or document forever.** Option B's role would have to be carried in tokens + both preset dark blocks + css-tokens + safelist + the contrast gate in perpetuity, for a one-notch cosmetic gain.

Per [ADR-0010](./0010-semver-policy.md)'s `@willink-labs/react` table, "change a default prop value" (here, the default visual of a built-in variant) is **MINOR** — compile-safe, no prop/type/a11y-semantics change. It ships MINOR with an explicit CHANGELOG migration note. Consumers who relied on exactly brand-600 in light can re-pin with `className="text-brand"` (discouraged in dark contexts — it fails AA there).

### 2. DS-wide audit of the bug class — one more fix, one documented exclusion

Grepping the React sources for fixed brand foregrounds (`text-brand` / `text-brand-600` / `text-brand-700`) used as text colors:

- **`AccordionTrigger` — `hover:text-brand` → `hover:text-brand-hover` (FIXED).** Same bug: brand-600 (invariant) text on `bg` (flipping), so the trigger label turned 3.54:1 on hover in dark. `brand-hover` flips (light brand-700 / dark brand-500 = 4.76:1, AA). Resting state was already `text-fg` (flips fine).
- **`RadioGroupItem` — `text-brand` (LEFT UNCHANGED, documented).** Here `text-brand` sets `currentColor` for the 8 px selected-state **indicator dot** (`<Circle className="fill-current">`), a *graphical/UI object*, not text. WCAG 1.4.11 (non-text contrast) applies, with a **3:1** threshold — and brand-600 on dark `bg` is **3.54:1**, which clears it. The dot is also the deliberate brand-identity signal (it pairs with `border-brand`). Promoting it to a flipping role would be a cosmetic change with no contrast requirement behind it, so it stays brand-600.
- Everything else that matched (`text-brand-fg` on `bg-brand`, `text-brand-soft-fg` on `bg-brand-soft`, `text-success/warning/danger`) is already either an invariant pair on an invariant surface, or two flipping roles flipping together — all gated and passing. No other fixed-brand-text-on-flipping-surface instance exists.

The contrast gate gains two new **required** pairs (both modes, ≥ 4.5): `brand-soft-fg / bg` (the link resting) and `brand-hover / bg` (the link / accordion hover) — so this bug class can never silently regress.

### 3. `info-fg` — DEFER (do not upstream this cycle); #59 stays open

**Verdict: NO.** The local `--color-info-fg` is **not** promoted to the DS this cycle. Reasoning (recorded so the decision is auditable, per the issue):

1. **The demonstrated need is a single usage, not a structural one.** Across the entire i-willink.com codebase, `text-info-fg` appears in **exactly one place** — a decorative "メリット" (pros) heading in one insights article. Contrast this with the precedent that *did* justify upstreaming: the [ADR-0016](./0016-text-emphasis-roles.md) `fg-*` ladder was promoted because the need was **structural** (any consumer with a >2-tier type hierarchy) and **pervasive** (used throughout the site). The promote-on-reproduction bar ("promote when a second consumer reproduces the need / the use is structural") is not met by one decorative heading.
2. **No info *family*, so the role would be an orphan.** The DS feedback set is `success` / `warning` / `danger`; there is deliberately **no `info` hue anywhere** in the semantic layer, and i-willink.com has no `bg-info` / `--color-info` surface either — `info-fg` exists alone, with no tinted surface, border, or accent counterpart. Upstreaming it means either (a) shipping a lone blue text role with no family (an asymmetric half-built feedback color), or (b) inventing the whole `info` family (surface + fg + border) — over-scope with zero demonstrated need for the surface side. Both are worse than deferring.
3. **The recurrence test isn't satisfied.** Only one consumer, one site, one location has reached for it. The same discipline that *correctly* kept `fg-*` local until i-willink.com grew it AND the need proved structural says: leave `info-fg` local, observe, and promote it if and when a real second use (or a structural pattern) appears.
4. **The consumer has a cheap, contract-correct alternative today.** That single heading can use the existing flipping `text-fg-emphasis` or `text-brand-soft-fg` (both pass AA in both modes), letting the site drop its 2-line local `--color-info-fg` block entirely — or simply keep the tiny local role until a real recurrence justifies a DS role.

This mirrors the ADR-0013/0016 principle of **minimalism with evidence**: the DS ships the smallest correct surface and promotes a consumer-grown role only when the need is reproduced and structural. #58's fix needed *zero* new tokens; #59's role does not yet earn one.

#59 is **left open** with this reasoning posted as a comment — it is a defer, not a reject, and should be re-evaluated if a second consumer or a structural info-text need appears.

## Scope

| Area | What ships |
|---|---|
| `react` | `Button` `link` variant resting `text-brand` → `text-brand-soft-fg`; `AccordionTrigger` `hover:text-brand` → `hover:text-brand-hover`. Button + Accordion unit tests updated; Button `Link` story gains a dark-context note. **MINOR** ([ADR-0010](./0010-semver-policy.md): default-visual change) |
| `tokens` / `tailwind-preset` / `css-tokens` | **No source change** — the fix reuses existing roles (`brand-soft-fg`, `brand-hover`) already present in tokens, both preset dark blocks, the safelist, and the css-tokens output. Lockstep-marker CHANGELOG entries only |
| Verification | `scripts/check-contrast.mjs` + 2 required pairs both modes: `brand-soft-fg / bg` (link resting) and `brand-hover / bg` (link / accordion hover) |
| Docs | this ADR; [v1.7 roadmap](../roadmap/v1.7.md); README roadmap line; [a11y matrix](../a11y/matrix.md) Button + Accordion rows |
| `info-fg` (#59) | **Not shipped.** Deferred; #59 left open with the reasoning above |

No token surface grows; no new mechanism. The two preset dark blocks are untouched.

## Consequences

- The DS link (and accordion-trigger hover) are now legible in both modes — the dark contract holds for brand text, not just surfaces.
- The bug class ("fixed brand foreground on a flipping surface") is cleared DS-wide and frozen behind two new contrast-gate pairs; a future component that reaches for `text-brand` on `bg` will be caught by review against this ADR, and any role regression by CI.
- Light-mode resting links are a single ramp step darker (brand-600 → brand-700) — a deliberate, contrast-improving MINOR with a CHANGELOG migration note.
- The semantic layer does **not** gain an `info` hue this cycle; the DS stays at the minimal `success`/`warning`/`danger` feedback set. The decision is revisitable (#59 open) if a structural info-text need is reproduced.

## Related

- [ADR-0013](./0013-dark-mode.md) — semantic-flip / primitive-invariant; the `brand-soft-fg` / `brand-hover` dark flips this fix relies on
- [ADR-0010](./0010-semver-policy.md) — default-visual change = MINOR (react table)
- [ADR-0012](./0012-release-verification-policy.md) — modified-component verification (affected unit tests, story note, a11y-matrix row) + Layer 2 release gate applied this cycle
- [ADR-0016](./0016-text-emphasis-roles.md) — the upstreaming precedent; its structural-need bar is the one `info-fg` fails
- [v1.7 roadmap](../roadmap/v1.7.md) — this cycle
- Issues [#58](https://github.com/willink-oss/willink-design-system/issues/58) (closed by this cut) · [#59](https://github.com/willink-oss/willink-design-system/issues/59) (deferred, left open)
