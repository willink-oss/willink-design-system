# ADR-0016: Text emphasis roles — a `fg-*` foreground ladder between `fg` and `muted`

- **Status**: Accepted
- **Date**: 2026-06-13
- **Phase**: v1.6 cycle (text-emphasis upstreaming)

## Context

The DS semantic layer has shipped exactly two foreground text roles since 1.0.0:

- `fg` — strongest body text (`neutral-900` light / `neutral-50` dark)
- `muted` — weakest supporting text (`neutral-500` light / `neutral-400` dark)

Two steps is enough for a button label and a helper line, but real pages have a *ladder* of emphasis between them — headings, labels, links, secondary paragraphs, captions, placeholders, separators. With only `fg` and `muted`, consumers reach past the semantic layer into numeric `text-neutral-{600,700,800,…}` utilities to express the in-between steps. Those numeric utilities **do not flip in dark mode** (ADR-0013: primitives are mode-invariant), so a dark rollout freezes them into light-mode grays — exactly the leak class the v1.2 survey catalogued for surface roles.

The i-willink.com dark rollout (v1.5, [v1.5 roadmap](../roadmap/v1.5.md) Outcome 3) hit this and grew a **local** app-extension foreground scale in its `globals.css`: five `--color-fg-*` roles mapped to neutral steps with a dual-block dark flip mirroring the preset's [ADR-0013](./0013-dark-mode.md) contract. Because the DS neutral scale **is** the slate scale, those roles kept the site's pre-DS `text-slate-{300..800}` typography byte-identical in light while gaining a correct dark flip. They were flagged as v1.6 upstreaming candidates ("promote into `tokens` if a second consumer reproduces the need").

The need is structural, not site-specific: any consumer with more than a two-tier type hierarchy reaches for these steps, and every one that does it with numeric utilities re-introduces the dark-mode freeze. Upstreaming the ladder as official semantic roles closes the gap for the whole fleet and removes the only reason a DS consumer touches `text-neutral-*` for body copy.

## Decision

Promote the i-willink.com `fg-*` ladder into `@willink-labs/tokens` as five official semantic roles, slotted **between** the existing `fg` and `muted`. The full foreground ladder, strongest → weakest:

| role | light | dark | contrast on `bg` (light / dark) | contrast contract | typical use |
|---|---|---|---|---|---|
| `fg` *(existing)* | `neutral-900` | `neutral-50` | 17.85 / 19.28 | ≥ 7 (AAA) | body text |
| **`fg-strong`** | `neutral-800` | `neutral-100` | 14.63 / 18.41 | **≥ 7 (AAA)** | headings / strong runs |
| **`fg-emphasis`** | `neutral-700` | `neutral-200` | 10.35 / 16.36 | **≥ 7 (AAA)** | labels / links / emphasized body |
| **`fg-secondary`** | `neutral-600` | `neutral-300` | 7.58 / 13.59 | **≥ 4.5 (AA)** | secondary body |
| `muted` *(existing)* | `neutral-500` | `neutral-400` | 4.76 / 7.87 | ≥ 4.5 (AA) | supporting text |
| **`fg-subtle`** | `neutral-400` | `neutral-500` | 2.56 / 4.24 | **documented baseline** | captions / meta / placeholders |
| **`fg-faint`** | `neutral-300` | `neutral-600` | 1.48 / 2.66 | **documented baseline** | disabled text / separators |

### Naming + canonical set

- **Keep `fg` and `muted` as-is.** They are the two anchors of the ladder (strongest body / weakest supporting text) and are already part of the frozen 1.0 contract. Renaming or re-slotting them would be a MAJOR for zero benefit; the new roles fit *around* them.
- **Adopt the i-willink.com names verbatim** (`fg-strong` / `fg-emphasis` / `fg-secondary` / `fg-subtle` / `fg-faint`). They are already in production, describe emphasis intent rather than a numeric step, and reading the ladder top-to-bottom (`fg` → `fg-strong` → `fg-emphasis` → `fg-secondary` → `muted` → `fg-subtle` → `fg-faint`) is monotonic and self-documenting. Inventing new names would force the upstreaming consumer to re-learn its own vocabulary.
- **No redundancy / no aliasing needed.** Every role maps to a *distinct* neutral step, and none collides with an anchor:
  - `fg-strong` = `neutral-800` ≠ `fg` = `neutral-900` — distinct, so not an alias of `fg`.
  - `fg-secondary` = `neutral-600` and `muted` = `neutral-500` are **adjacent but distinct** steps; `fg-secondary` is the "one notch stronger than muted" rung the two-tier surface couldn't express, so it earns its own role rather than aliasing `muted`.
  - `fg-faint` = `neutral-300` ≠ `muted` = `neutral-500` — distinct, so not an alias of `muted`.
  No role is dropped and none is aliased; the ladder is minimal (five rungs, each a unique step) with no duplicate.

### Mapping mechanism (rides the existing machinery)

Each role is defined as a **neutral-scale alias**, not a raw hex — light via `$value: "{color.neutral.N}"`, dark via `$extensions["willink.dark"].$value`. This is identical to how `fg` / `muted` / the surface roles work, so the new roles automatically ride:

- the **dark-flip machinery** ([ADR-0013](./0013-dark-mode.md)): the preset's two dual blocks and `css-tokens` `tokens.dark.css` flip them with no special-casing;
- the **consumer override surface**: a consumer who re-aliases `--color-neutral-700` sees `fg-emphasis` follow, exactly as with every other neutral-derived role.

Because the DS neutral scale *is* the slate scale i-willink.com used, the upstream roles render byte-identical to the site's pre-existing local definitions in light — the later migration is a pure find-and-replace of `text-fg-*` for the local custom utilities, with no visual diff.

### Contrast contracts (per-role, both modes)

`scripts/check-contrast.mjs` asserts each new role against `bg` in **both** modes, with the target chosen by the role's job:

- **`fg-strong` / `fg-emphasis` ≥ 7:1 (AAA, required).** They sit above `fg-secondary` in emphasis; both clear AAA in both modes, so the gate holds them to AAA. A regression that demoted either below 7 fails CI.
- **`fg-secondary` ≥ 4.5:1 (AA, required).** It is real secondary *body* text, so it must clear the WCAG 1.4.3 normal-text minimum. Passes in both modes (7.58 / 13.59).
- **`fg-subtle` / `fg-faint` — documented report-only baselines** (printed with ⚠, never fatal), exactly the treatment `muted` on white and the feedback colors already get under ADR-0013. They are **not body-text roles**: `fg-subtle` (captions / meta / placeholders, 2.56 light / 4.24 dark) and `fg-faint` (disabled text / separators, 1.48 light / 2.66 dark) intentionally fall below the 4.5 floor. Documenting the floor as a visible number — rather than silently shipping a sub-4.5 role that looks "required" — keeps the audit honest and tells adopters precisely which rungs are safe for content text (the three above `muted`) and which are decorative/disabled tiers.

This mirrors ADR-0013's principle: mechanical gates verify what *can* be a number; the floor for intentionally-faint tiers is documented, not enforced as a pass.

## Scope

| Area | What ships |
|---|---|
| `tokens` | 5 new semantic roles in `semantic.json` (`fg-strong/-emphasis/-secondary/-subtle/-faint`), each a neutral alias + a `willink.dark` extension; schema test asserts the ladder |
| `tailwind-preset` | 5 light `--color-fg-*` declarations + the same 5 in **both** dark blocks (kept textually in sync per ADR-0013); `text-fg-*` safelist entries |
| `css-tokens` | regen — the 5 vars appear in `tokens.css` / `tokens.semantic.css` and flip in `tokens.dark.css` (+ root proxies); generated-file tests assert light + dark |
| Verification | `scripts/check-contrast.mjs` extended with the 5 role/bg pairs (strong/emphasis ≥ 7, secondary ≥ 4.5 required; subtle/faint report-only); token + css-tokens var-count / dark-coverage / contrast tests |
| Docs | this ADR; [v1.6 roadmap](../roadmap/v1.6.md); README roadmap line + css-tokens / preset role notes; [a11y matrix](../a11y/matrix.md) adopter note documenting the ladder's contrast floor |

No React component changes: components opt in (or not) via the `text-fg-*` utilities; nothing in the frozen component surface moves.

## Consequences

- Consumers gain a full foreground emphasis ladder for free — and, critically, one that **flips in dark mode**, removing the only remaining reason a DS consumer reaches into `text-neutral-*` for body copy.
- i-willink.com (and any future consumer that grew the same local scale) can delete its custom `--color-fg-*` block and replace local utilities with `text-fg-*` — a pure find-and-replace with no light-mode visual diff (a separate follow-up task does this migration).
- The token surface grows by 5 roles (MINOR per [ADR-0010](./0010-semver-policy.md)); the `willink.dark` extension convention is reused unchanged. The two preset dark blocks now carry 5 more declarations each — the must-stay-in-sync convention from ADR-0013 still governs them.
- The contrast gate now encodes a per-role policy (AAA / AA / documented-floor) rather than a single threshold, making "is this role body-text-safe?" a CI-verified question for the three required rungs and a documented number for the two decorative tiers.

## Related

- [ADR-0010](./0010-semver-policy.md) — new semantic keys / new preset variables / new utilities classify as MINOR
- [ADR-0013](./0013-dark-mode.md) — the dark-flip mechanism (dual blocks, `willink.dark` extensions, contrast gate) these roles ride
- [ADR-0012](./0012-release-verification-policy.md) — token-row verification applied to this PR
- [v1.5 roadmap](../roadmap/v1.5.md) Outcome 3 — where the `fg-*` upstreaming candidate was flagged
- [v1.6 roadmap](../roadmap/v1.6.md) — this cycle
