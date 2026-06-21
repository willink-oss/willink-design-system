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
| `settings-form` | `registry:block` | Settings surface (Tabs + Card + FormField + Input + Switch + Select + RadioGroup + Button) — tabbed sections of grouped setting rows with a save/cancel footer. |
| `command-palette` | `registry:block` | ⌘K modal command palette (Command + Dialog) — keyboard toggle, fuzzy search, grouped commands + shortcuts, empty state. |
| `page-header` | `registry:block` | App page header (Breadcrumb + Badge + ButtonGroup + Button + DropdownMenu) — breadcrumb, title + status badge, primary/secondary actions (`onClick`), overflow menu (`onSelect`). |
| `comparison-table` | `registry:block` | Tiered comparison matrix (Table + ToggleGroup + HoverCard + Badge + Button) — billing toggle, ✓/✗ cells with text alternatives, feature explainers, per-plan CTAs. |
| `confirm-dialog` | `registry:block` | Destructive-confirm dialog (AlertDialog + Button) — focus-trapped `alertdialog`, danger confirm wired to `onConfirm`. |
| `dashboard-shell` | `registry:block` | Responsive app shell (Sheet + ScrollArea + Avatar + DropdownMenu + Button + Badge + Separator) — desktop sidebar / mobile drawer nav, topbar with user menu, wraps `children`. |
| `team-grid` | `registry:block` | Team/people grid (Card + Avatar + HoverCard + Badge) — avatar, name, role badge, optional bio popover. |
| `article-card` | `registry:block` | Blog/article preview card (Card + Badge + Avatar + Button) — category, title, excerpt, author + date, read-more link. |
| `stat-highlight` | `registry:block` | Rich KPI card (Card + Progress + Badge) — label, big value, trend badge, goal progress bar. |
| `subscribe-inline` | `registry:block` | Inline email capture (FormField + Input + Button + Alert) — single-field subscribe with validation + success alert (`onSubscribe`). |
| `newsletter-signup` | `registry:block` | Card newsletter signup (Card + FormField + Input + Checkbox + Button + toast) — email + consent, success toast (mount `<Toaster/>` at app root). |
| `logo-cloud` | `registry:block` | "Trusted by" logo strip (ScrollArea + Avatar + Skeleton + Tooltip) — scrollable greyscale logos with name tooltips + loading state. |

## Authoring a block

Block sources live in `registry/blocks/<name>/<name>.tsx` and compose the
`@willink-labs/react` primitives. They are **type-checked** against the real
primitive APIs — `pnpm --filter registry build` runs `tsc --noEmit` before
`shadcn build`, so a block that uses a non-existent prop/export fails the build
(and the deploy) instead of shipping broken copy-to-own code. Block wrapper
classes are scanned by the **consumer's** Tailwind (the source is copied into
their repo), so the preset safelist does not apply to them — only the primitives
they compose need safelisting (handled in `@willink-labs/tailwind-preset`).
