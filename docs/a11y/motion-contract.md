# Motion Contract

> What every animation in the DS commits to, what the override surface is, and how `prefers-reduced-motion` is honored. Audience: component authors and consumers tuning the motion feel.

## Token layers

Three layers — primitive → semantic role → utility — let consumers retune a single interaction without touching primitives.

```
primitive (tokens/src/primitive.json):
  duration.fast (150ms) / .base (250ms) / .slow (400ms)
  easing.standard (cubic-bezier(0.2, 0, 0, 1)) / .emphasized (cubic-bezier(0.3, 0, 0, 1.1))

semantic (tokens/src/semantic.json — 0.12.0+):
  motion.modal-enter / .modal-exit         → {duration.fast}
  motion.popover-enter / .popover-exit     → {duration.fast}
  motion.tooltip-enter / .tooltip-exit     → {duration.fast}
  motion.sheet                              → {duration.fast}
  motion.accordion                          → {duration.base}
  motion.toast                              → {duration.base}   (declarative — Sonner controls its own duration)
  easing.enter / .exit                      → {easing.standard}
  easing.emphasized-enter                   → {easing.emphasized}

CSS variables (tailwind-preset/src/preset.css):
  --duration-{role} and --ease-{role} mirror semantic.json
  Tailwind v4 auto-generates `duration-{role}` utility classes from each --duration-* entry
```

## Component motion table

| Component | Animations | Bound to |
|---|---|---|
| `Dialog` | overlay fade-in/out + content scale-fade in/out | `--duration-modal-{enter,exit}` + `--ease-{enter,exit}` |
| `AlertDialog` | same as Dialog | same as Dialog |
| `Sheet` | overlay fade + 4-side slide (8 keyframes) | `--duration-sheet` + `--ease-{enter,exit}` |
| `Accordion` | content height + chevron rotation | `--duration-accordion` + `--ease-{enter,exit}` |
| `Tooltip` | fade-in/out (delayed-open) | `--duration-popover-{enter,exit}` + `--ease-{enter,exit}` (uses popover role) |
| `DropdownMenu` / `Select` | overlay fade-in/out (Radix-controlled) | inherits `--duration-popover-*` |
| `Toast` (Sonner) | library-controlled slide / fade | declarative `--duration-toast` (not wired); reduced-motion handled via `[data-sonner-toaster]` block |
| `animate-fade-up` | hero reveal | `0.5s` literal + `--ease-standard` (intentional, not bound to a semantic role yet) |

## `prefers-reduced-motion: reduce` strategy

Two layers — component-level Tailwind variant + preset-level CSS safety net — both ship from 0.13.0.

### Layer 1 — Tailwind `motion-reduce:*` on components

Each component that runs a keyframe declares the reduced-motion behavior next to the animation class:

```tsx
// DialogOverlay
className={cn(
  "fixed inset-0 z-50 bg-black/50",
  "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
  "motion-reduce:animate-none",
)}
```

This is the readable, intention-bearing layer. A future component author can see the contract in one place.

### Layer 2 — preset.css safety net

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-out,
  .animate-fade-up,
  .animate-dialog-in,
  .animate-dialog-out,
  .animate-sheet-in-{left,right,top,bottom},
  .animate-sheet-out-{left,right,top,bottom},
  .animate-accordion-down,
  .animate-accordion-up {
    animation-duration: 0ms !important;
  }
  [data-sonner-toaster] [data-sonner-toast] {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
  }
}
```

This catches:
- Component authors who forget to add `motion-reduce:animate-none`.
- The Sonner toast library, whose internal transitions are not reachable via Tailwind variants.
- Future utility usage where the class is applied dynamically (e.g. via `clsx(...)` conditionals).

The two layers are intentionally redundant — a single missed `motion-reduce:` variant should not regress accessibility.

## Override patterns

### Make accordions instant globally

```css
:root {
  --duration-accordion: 0ms;
}
```

### Slow the dialog enter for marketing splash

```css
:root {
  --duration-modal-enter: 400ms;
  --duration-modal-exit:  200ms;
}
```

### Pin the dialog to the standard rather than role-based curve

```css
:root {
  --ease-enter: var(--ease-standard);
}
```

(The default already points there; this is shown as a pattern.)

## Known gap

`Skeleton` uses Tailwind's `animate-pulse`, which is not in the DS keyframe utility set and therefore not covered by Layer 2. Consumers needing reduced-motion `Skeleton` can either:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-pulse { animation: none !important; }
}
```

or wait for 0.14.0 which will fold `animate-pulse` into the preset block.

## See also

- ADR-0008 (motion-contract) — design rationale for the role-based motion semantic layer
- [`docs/a11y/matrix.md`](./matrix.md) — full WCAG 2.1 AA component matrix
