# ADR-0015: FormField compound API — minimal a11y wiring, no form-state opinion

- **Status**: Accepted
- **Date**: 2026-06-11
- **Phase**: v1.4 cycle (FormField compound)

## Context

`FormField` is the longest-deferred React item on the roadmap: the v1.0 Phase 9.1 API audit deferred it ("the current `Input` + `Label` + Radix combination is sufficient; a compound API deserves its own design cycle"), and v1.1–v1.3 each carried it forward. The deferral was deliberate — a form compound is where design systems over-design (validation engines, schema coupling, layout opinions).

Meanwhile the hand-wiring burden is real and documented in three places that all repeat the same five-attribute dance:

- `packages/react/README.md` ships a "FormField composition pattern (推奨)" snippet telling every consumer to write the wrapper themselves;
- `apps/storybook/src/stories/input.stories.tsx` (the `Invalid` story) documents the contract — `aria-invalid` + `aria-describedby` pointing at a manually-id'd `<p>`;
- `apps/playground` repeats it again with hand-picked `ds-email-err` / `ds-email-err-msg` ids.

The failure modes are exactly the consumer-side mistakes the a11y matrix warns about: forgotten `htmlFor`, `aria-describedby` referencing nothing (an axe `aria-valid-attr-value` violation), `aria-invalid` set on the input but the message not associated, ids colliding across list-rendered fields. The Storybook a11y pass can only catch these per-story; the DS can eliminate the class of error.

## Decision

Ship a five-part compound — `FormField` / `FormFieldLabel` / `FormFieldControl` / `FormFieldDescription` / `FormFieldError` — as the 25th component of `@willink-labs/react`, scoped strictly to **a11y wiring**. It is not a form-state manager.

### 1. Context-provided ids, generated with `useId()`

`FormField` (a `div`, `grid gap-2`) generates `controlId` / `descriptionId` / `errorId` from a single `useId()` base and provides them over React context. List-rendered fields can never collide; consumers never invent ids. Subcomponents throw a descriptive error when used outside `FormField`.

### 2. `FormFieldControl` is a Radix `Slot` — zero new runtime deps

Per [ADR-0002](./0002-radix-ui-selective.md) the headless mechanics are delegated, and `@radix-ui/react-slot` is already a dependency (Button `asChild`). The Slot takes exactly one element child — `Input`, `Textarea`, a native `<select>`, a Radix trigger — and injects `id`, `aria-describedby`, and `aria-invalid` onto it. A consumer-supplied `aria-describedby` on `FormFieldControl` is **merged** (consumer ids first, then description, then error). Per Radix Slot semantics, props set directly on the child element win — that is the documented escape hatch, with the caveat that overriding `id` on the child means re-wiring `htmlFor` yourself.

### 3. Presence detection by direct-children inspection — SSR-safe, no effects

`aria-describedby` must only reference nodes that exist (dangling references fail axe `aria-valid-attr-value` — the known flaw in shadcn/ui's `form.tsx`, which emits its description id unconditionally). Detection options considered:

- **(a) Effect-based registration** (children register via context state): rejected — the server-rendered HTML lacks the aria attributes until hydration, which is an a11y regression for exactly the consumers (WordPress-adjacent, no-JS-first) this DS serves.
- **(b) Unconditional id emission** (shadcn): rejected — ships axe violations whenever description/error are omitted.
- **(c) Render-time inspection of `FormField`'s direct children** (`Children.toArray` + element-type check): **chosen** — single-pass, deterministic, SSR-correct. Constraint: `FormFieldDescription` / `FormFieldError` must be *direct* children of `FormField` (documented in the JSDoc). Wrapping them in intermediate elements silently degrades to "not detected"; acceptable for a minimal v1 surface, and the grid wrapper removes most reasons to nest.

### 4. Error state derives from error content; `invalid` prop is the override

`FormFieldError` renders **only when it has content**, so `<FormFieldError>{errors.email}</FormFieldError>` can stay mounted unconditionally — the empty case renders nothing, sets no `aria-invalid`, and emits no error id. When content is present, the control automatically gets `aria-invalid` (which is what `Input` / `Textarea` already style against, `aria-[invalid=true]:border-danger`). `FormField`'s `invalid?: boolean` prop exists solely as an explicit override (e.g. invalid without a message); no double bookkeeping in the common case.

### 5. `role="alert"` on the error message

Existing demos used a bare `<p>`; the compound upgrades this. `aria-describedby` alone associates the message but does not announce it when it *appears* — `role="alert"` (implicit `aria-live="assertive"`) makes dynamically-surfacing validation errors audible, the standard form-validation pattern. The double-exposure on focus (described-by + alert) is accepted, conventional behavior.

### 6. What is deliberately absent

- **No CVA** — no variants are warranted ([ADR-0001](./0001-cva-for-variants.md) reserves CVA for variant surfaces). Plain `cn()`.
- **No validation / schema / react-hook-form coupling** — shadcn's `Form` family was evaluated and rejected: it imports `react-hook-form` at runtime and bakes in a state-management opinion. This compound works identically with RHF, TanStack Form, server actions, or `useState` — anything that yields an error string.
- **No layout props** (`orientation`, `inline`, …) — `className` on the wrapper covers it.
- **No `FormFieldLabel` re-styling** — it is `Label` (size / `required` unchanged) with `htmlFor` pre-wired.

### SemVer / safelist

MINOR per [ADR-0010](./0010-semver-policy.md) (new component + 10 new exports). One new class string crosses the dist boundary: `text-danger` (`FormFieldError`) joins the preset safelist — also MINOR, and a real `tailwind-preset` entry this cycle rather than a lockstep marker.

## Consequences

- The README's "write your own FormField" pattern is retired; the three duplicated hand-wiring demos now have a canonical replacement, and new consumer code cannot mis-wire `htmlFor` / `describedby` / `invalid` without actively overriding.
- The direct-children constraint is the API's main sharp edge. If real consumers need nested layouts, the escalation path is an explicit registration API (option a, with SSR caveats re-evaluated) — not silent deep traversal.
- `props.children` type-inspection means `FormFieldDescription` / `FormFieldError` cannot be re-wrapped (`memo`, styled wrappers) and still be detected — same documented constraint.
- The frozen surface grows by 10 exports; all five prop types are exported per the house template, so the d.ts-diff verification row in [ADR-0012](./0012-release-verification-policy.md) covers future drift.

## Related

- [ADR-0001](./0001-cva-for-variants.md) — CVA reserved for variant surfaces (not used here)
- [ADR-0002](./0002-radix-ui-selective.md) — Slot reuse; no new Radix primitive needed
- [ADR-0010](./0010-semver-policy.md) — MINOR classification
- [ADR-0012](./0012-release-verification-policy.md) — component-new verification row applied to this PR
- [v1.4 roadmap](../roadmap/v1.4.md) — cycle scope and outcome
- [`docs/a11y/matrix.md`](../a11y/matrix.md) — FormField row (React table → 25 components)
