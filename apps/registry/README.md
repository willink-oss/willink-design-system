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

Static host of `public/` at **registry.i-willink.com**. Public MIT. A consumer
adds the registry to its `components.json`:

```json
{ "registries": { "@willink": "https://registry.i-willink.com/r/{name}.json" } }
```

then `npx shadcn add @willink/<item>`.

## Items

| Item | Type | Notes |
|---|---|---|
| `cn` | `registry:lib` | clsx + tailwind-merge class combiner (the shared utility). |

Blocks (`@willink/contact-form`, `@willink/page-hero`, …) and primitive
registry-items land in follow-up issues. A Next.js preview site is a later
addition; this scaffold is the JSON pipeline only.
