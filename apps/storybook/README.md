# willink-storybook

Storybook workspace for `@willink-labs/react` — the component catalog that pairs with the
[WCAG 2.1 AA compliance matrix](../../docs/a11y/matrix.md).

```bash
pnpm -F willink-storybook dev    # http://localhost:6006
pnpm -F willink-storybook build  # static build (also runs in the CI quality gate via `pnpm -r build`)
```

## Theme toggle (light / dark / auto)

The toolbar has a **Theme** selector backed by a hand-rolled decorator in
`.storybook/preview.ts` (no `@storybook/addon-themes` — it would be a new dependency, and the
contract is one attribute). It rides the [`data-theme` contract (ADR-0013)](../../docs/adr/0013-dark-mode.md):

- **Light / Dark** set `<html data-theme="light|dark">` — the explicit override path.
- **Auto (OS)** removes the attribute, so the preset's `prefers-color-scheme: dark`
  media-query path follows the OS preference.

The default is **light** so a11y-addon (axe) runs are deterministic regardless of the
reviewer's OS scheme. The preview canvas follows the flip because `.storybook/preview.css`
binds `html, body` to `var(--color-bg)` / `var(--color-fg)`. A story can pin a theme with
story-level globals (`globals: { theme: "dark" }` — see `button.stories.tsx > DarkForced`).

## Conventions

- One `src/stories/<component>.stories.tsx` per exported component family, CSF3 format
  (`satisfies Meta<…>` + `StoryObj`). Stories import from `@willink-labs/react` — never from
  `packages/react/src` — so they exercise the same build adopters consume.
- Tailwind v4 runs through `@tailwindcss/vite`; the brand theme comes from
  `@willink-labs/tailwind-preset/preset.css` imported once in `.storybook/preview.css`,
  exactly like a consumer app.
- `@storybook/addon-a11y` runs axe on every story (`a11y: { test: "error" }` in
  `preview.ts`). The per-component WCAG status it checks against is documented in
  [`docs/a11y/matrix.md`](../../docs/a11y/matrix.md) — update both together.
- Same-PR-content rule (Phase 0 guardrail): a PR that touches Storybook tooling must also
  add or update at least one story.

## Roadmap

Versions: Storybook **10.x** (the v1.0-era roadmap said "Storybook 9"; 10 was current stable
by the time the bootstrap landed — recorded on issue [#12](https://github.com/willink-oss/willink-design-system/issues/12)).
Remaining stories land in batches of five per the [v1.1 roadmap](../../docs/roadmap/v1.1.md).
