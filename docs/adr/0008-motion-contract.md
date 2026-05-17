# ADR-0008: Role-based motion semantic tokens + reduced-motion contract

- **Status**: Accepted
- **Date**: 2026-05-17
- **Phase**: 9.2 (v1.0.0 release prep — accessibility + motion stability)

## Context

Through 0.11.0 the DS exposed motion only as **primitive** CSS variables (`--duration-fast/base/slow`, `--ease-standard/emphasized`). Components reached for these directly inside Tailwind utility classes (`var(--duration-fast)` baked into the `@utility animate-dialog-in` rule).

This caused two problems for the v1.0.0 stability bar:

1. **Override surface is too coarse.** A consumer who wants a snappier accordion ("collapse instantly") has to redefine `--duration-base` globally, which also retunes Toast and any future role that happens to share that primitive. The override blast radius is "the whole system feels different" instead of "the accordion feels different".

2. **No accessibility contract.** The DS did not document or enforce `prefers-reduced-motion: reduce` behavior. Components ran the same keyframes regardless of the user's OS setting — a WCAG 2.3.3 gap that adopters in regulated industries (clublink-platform, i-willink.com hero CTAs, fit-ai) cannot accept.

The v1.0.0 release roadmap (Phase 9.2) names both as blockers.

## Decision

**Add a role-based semantic motion layer between primitives and component utilities, and bind every animation to a two-layer `prefers-reduced-motion` strategy.**

### 1. Token layer (0.12.0)

`packages/tokens/src/semantic.json` ships a new `motion` block and a new `easing` block. Each entry aliases a primitive under a role-based name:

- `motion.modal-enter` / `motion.modal-exit` → `{duration.fast}` (Dialog, AlertDialog)
- `motion.popover-enter` / `motion.popover-exit` → `{duration.fast}` (DropdownMenu, Select)
- `motion.tooltip-enter` / `motion.tooltip-exit` → `{duration.fast}`
- `motion.sheet` → `{duration.fast}` (open/close symmetric)
- `motion.accordion` → `{duration.base}` (open/close symmetric)
- `motion.toast` → `{duration.base}` (declarative only — Sonner controls its own duration; reserved for a future wiring)
- `easing.enter` / `easing.exit` → `{easing.standard}`
- `easing.emphasized-enter` → `{easing.emphasized}` (emphasized has no exit counterpart by design; emphasized decelerate is entry-only per Material Motion convention)

### 2. CSS variable layer (0.12.0)

`packages/tailwind-preset/src/preset.css` declares the role names as CSS variables on `@theme`, each pointing at the primitive var:

```css
--duration-modal-enter:    var(--duration-fast);
--duration-accordion:      var(--duration-base);
/* ...nine more... */
```

Tailwind v4 auto-generates `duration-{role}` utility classes from each `--duration-*` entry, so component CSS can use `transition-transform duration-accordion` instead of arbitrary values.

Every `@utility animate-*` rule in the preset references the new role variables instead of primitives — `animate-dialog-in` now reads `var(--duration-modal-enter)` etc. The alias chain resolves to the same primitive values, so no behavior change ships in 0.12.0; the added surface is **override granularity**.

### 3. Reduced-motion contract (0.13.0)

Two layers, both shipped in `@willink-labs/tailwind-preset@0.13.0` and `@willink-labs/react@0.13.0`:

**Layer 1 — Tailwind variant on components**

Each animated component declares `motion-reduce:animate-none` (or `motion-reduce:transition-none` for transitions) alongside its animation class:

```tsx
"data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out",
"motion-reduce:animate-none",
```

This is the **readable contract**. Component authors see and own the reduced-motion intent next to the animation declaration. Applied to Dialog (overlay + content), AlertDialog (overlay + content), Sheet (overlay + content), Accordion (content + chevron), Tooltip (content).

**Layer 2 — CSS safety net in preset**

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in, .animate-fade-out, .animate-fade-up,
  .animate-dialog-in, .animate-dialog-out,
  .animate-sheet-{in,out}-{left,right,top,bottom},
  .animate-accordion-{down,up} {
    animation-duration: 0ms !important;
  }
  [data-sonner-toaster] [data-sonner-toast] {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

This catches:
- Component authors who omit the Tailwind variant (defense in depth).
- The Sonner toast library, whose transitions are library-owned and not reachable via Tailwind variants.
- Dynamic class application via `clsx(...)` where a `motion-reduce:` sibling cannot be inlined.

The two layers are intentionally redundant. A future `Skeleton`-style addition that forgets Layer 1 still gets reduced-motion behavior from Layer 2.

## Rationale

### Why semantic roles instead of one variable per component

Components share intent (every modal-style component opens with the same feel). Naming the role rather than the component lets the override scale: a consumer who tunes `--duration-modal-enter` retunes Dialog **and** AlertDialog together, which is the desired correlation. If we had named the variables after components (`--duration-dialog`, `--duration-alert-dialog`, ...), consumers would have to remember to keep them in sync.

### Why two layers for reduced-motion

A single layer is fragile:

- Tailwind-only is unreliable for libraries the DS does not control (Sonner). It also requires every future component author to remember.
- CSS-only hides the contract from the component code — a reader of `dialog.tsx` would not see that reduced-motion is honored.

Both layers cost a few lines each and remove a class of regressions.

### Why `motion.toast` is declarative-only

Sonner's transitions are configured at runtime via `toastOptions.duration`. There is no public hook for CSS variables to override them. We ship the semantic name so that:

- A future major version of Sonner (or a DS-side replacement) can read `--duration-toast` and the semantic naming is already in place.
- The motion contract document can list Toast in the same table as the other components without an asymmetric gap.

The `$description` in `semantic.json` warns adopters that the token is currently declarative.

## Consequences

### Positive

- Consumers can tune one interaction class without disturbing the global motion feel.
- WCAG 2.3.3 closes for every DS-owned animation (Skeleton flagged as a 0.14.0 follow-up — see [a11y matrix](../a11y/matrix.md)).
- ADR makes the contract reviewable. Future motion changes have a clear policy reference.
- Sonner integration is documented; future replacement can drop in.

### Negative

- One extra CSS variable layer to keep in sync. Mitigated by `primitive.schema.test.ts` asserting the presence and `$type` of every required semantic motion / easing role.
- Layer 2 uses `!important` to override component-level `animation-duration`. This is fine for the keyframe utilities (no consumer is expected to outsmart `!important` here) but is a smell that future motion work should keep in mind.

### Neutral

- `animate-fade-up` (hero reveal) is intentionally **not** bound to a semantic role. It is a one-off utility with no parallel use. If a `hero-reveal` role emerges (multiple usages, retune cases), promote it then.
- `Skeleton` `animate-pulse` is the one DS animation Layer 2 does not catch (it is a Tailwind built-in, not a DS utility). Documented in the a11y matrix as a 0.14.0 follow-up.

## Related

- ADR-0001 (cva-for-variants) — same multi-layer principle (variant API names → CSS classes)
- [`docs/a11y/matrix.md`](../a11y/matrix.md) — WCAG 2.1 AA per-component status
- [`docs/a11y/motion-contract.md`](../a11y/motion-contract.md) — practical override patterns
- `docs/roadmap/v1.0.md` Phase 9.2 — motivation
