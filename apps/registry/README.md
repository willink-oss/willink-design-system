# @willink registry

Self-hosted, shadcn-compatible **registry** for the willink design system — the
copy-to-own distribution channel for blocks and composition ([ADR-0020](../../docs/adr/0020-distribution-channels.md)).

- **What it is**: `registry.json` declares the `@willink` namespace and its items.
  `shadcn build` compiles it to static JSON under `public/r/*.json`.
- **What it is NOT**: the npm primitives (`@willink-labs/*`) remain the
  versioned, import-and-run contract layer. The registry is **additive** — items
  are copied into a consumer's repo (`npx shadcn add @willink/<item>`), and each
  block declares the npm primitives via `dependencies`
  (`@willink-labs/react` + `@willink-labs/tailwind-preset`), which `shadcn add`
  installs — the primitives are **not** re-vendored. (Blocks carry no
  `registryDependencies`: bare names there resolve against shadcn's official
  registry, not `@willink`.) Token theming is inherited via the
  `@willink-labs/tailwind-preset` dependency (one token source).

## Build

```bash
pnpm --filter registry build   # = `shadcn build` → public/r/*.json
```

The emitted `public/r/*.json` is a build artifact (gitignored); it is generated
on deploy.

## Deploy

The emitted `public/r/*.json` is published to **GitHub Pages** under `/r/`,
alongside the Storybook catalog and playground, by `.github/workflows/pages.yml`
on every push to `main`. Live base URL:

```
https://willink-oss.github.io/willink-design-system/r/{name}.json
```

Public MIT. A consumer either registers the namespace in its `components.json`:

```json
{ "registries": { "@willink": "https://willink-oss.github.io/willink-design-system/r/{name}.json" } }
```

then `npx shadcn add @willink/<item>`, **or** uses the direct URL:

```bash
npx shadcn add https://willink-oss.github.io/willink-design-system/r/contact-form.json
```

> A branded `registry.i-willink.com` alias is the planned future home; until it
> is stood up, the GitHub Pages URL above is the canonical, working registry URL.

## Items

| Item | Type | Notes |
|---|---|---|
| `cn` | `registry:lib` | clsx + tailwind-merge class combiner (the shared utility). |
| `contact-form` | `registry:block` | Token-themed contact form composing the `@willink-labs/react` primitives (FormField + Input + Textarea + Button). First composition block (ADR-0020). |
| `page-hero` | `registry:block` | Centered marketing hero (Badge + Button) — eyebrow, title, lead copy, primary/secondary CTAs. |
| `auth-form` | `registry:block` | Sign-in form (FormField + Input + Checkbox + Button + Separator) — email/password with inline validation, remember-me, alternate-action divider. |
| `pricing-card` | `registry:block` | A pricing tier (Card + Badge + Button) — plan, price, popular badge, feature list, CTA. Render several for a pricing table. |
| `faq` | `registry:block` | FAQ section (Accordion) — single-open collapsible question/answer list with an optional heading. |
| `testimonial` | `registry:block` | Customer-quote card (Card + Avatar) — quote with figure/figcaption attribution; avatar falls back to initials. |
| `stats` | `registry:block` | Responsive metrics row (Card) — a `<dl>` grid of label/value (+ optional delta) stat cards. |
| `data-table` | `registry:block` | Admin data table (Table + Checkbox + Badge + DropdownMenu + Pagination + Empty) — tri-state select-all, status badges, row-action menu (`onAction`), client-side pagination, empty state. |
| `feature-grid` | `registry:block` | Responsive feature grid (Card + Badge) — optional eyebrow/heading + a grid of title/description feature cards. |
| `cta-section` | `registry:block` | End-of-page CTA band (Badge + Button) — eyebrow, title, copy, primary/secondary CTAs (asChild links). |

## Authoring a block

Block sources live in `registry/blocks/<name>/<name>.tsx` and compose the
`@willink-labs/react` primitives. They are **type-checked** against the real
primitive APIs — `pnpm --filter registry build` runs `tsc --noEmit` before
`shadcn build`, so a block that uses a non-existent prop/export fails the build
(and the deploy) instead of shipping broken copy-to-own code. Block wrapper
classes are scanned by the **consumer's** Tailwind (the source is copied into
their repo), so the preset safelist does not apply to them — only the primitives
they compose need safelisting (handled in `@willink-labs/tailwind-preset`).
