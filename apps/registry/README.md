# @willink registry

Self-hosted, shadcn-compatible **registry** for the willink design system — the
copy-to-own distribution channel for blocks and composition ([ADR-0020](../../docs/adr/0020-distribution-channels.md)).

- **What it is**: `registry.json` declares the `@willink` namespace and its items.
  `shadcn build` compiles it to static JSON under `public/r/*.json`.
- **What it is NOT**: the npm primitives (`@willink-labs/*`) remain the
  versioned, import-and-run contract layer. The registry is **additive** — items
  are copied into a consumer's repo (`npx shadcn add @willink/<item>`), and
  block items' `registryDependencies` point at the npm primitives (no
  re-vendoring). Token theming is inherited via the `@willink-labs/tailwind-preset`
  dependency (one token source).

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

Blocks (`@willink/contact-form`, `@willink/page-hero`, …) and primitive
registry-items land in follow-up issues. A Next.js preview site is a later
addition; this scaffold is the JSON pipeline only.
