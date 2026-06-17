# ADR-0020: Distribution channels — dual-channel (npm primitives + a self-hosted shadcn registry)

- **Status**: Accepted
- **Date**: 2026-06-18
- **Phase**: v1.9 cycle (extensibility — component additions, template distribution, Tailwind-like extension)

## Context

The design system today ships as a runtime npm contract: `@willink-labs/{tokens,tailwind-preset,css-tokens,react}` move in lockstep ([ADR-0010](./0010-semver-policy.md)), publish via OIDC ([ADR-0007](./0007-oidc-trusted-publisher.md)), and the React package is `'use client'`-guarded (the #54 RSC defect). Consumers `npm install` and import — zero ownership, central upgrades, one version to track.

That model is excellent for **primitives** (Button, Input, Dialog…) but it does not serve two needs the products actually have:

- **Composition that should diverge per product.** ClubLink already hand-rolls organisms — a contact form, a page hero — that have no shared home. Versioning them inside the lockstep DS would force every product onto the DS's release cadence for changes that are inherently product-specific. These want **copy-to-own**, not a runtime dependency.
- **Whole-app starters.** New products (clublink marketing site, an i-willink.com app-shell) repeatedly re-wire the same boilerplate: the preset `@import`, the `data-theme` dark contract, the `@willink-labs/*` deps. There is no scaffold.

The 2026 ecosystem answer is the **shadcn registry** model: components/blocks distributed as JSON registry items that a CLI (`npx shadcn add`) copies into the consumer repo as source. A library can self-host a registry (`shadcn build` → static `/r/*.json`) and declare a namespace. This is additive — it does not require giving up a runtime package.

## Decision

**Run both channels. Keep the npm primitives as the versioned contract; add a self-hosted shadcn-compatible registry for blocks and composition. They compile against the same token layer, so they coexist with no conflict.**

### 1. npm primitives — the contract layer (unchanged)

`@willink-labs/react` (and the token/preset packages) remain the import-and-run path for teams who want zero ownership and central upgrades. Lockstep versioning, OIDC publish, the `'use client'` guard, and the release runbook are unchanged. New primitives are added here through the existing component checklist (`CONTRIBUTING.md`) as MINOR bumps.

### 2. Self-hosted shadcn registry — the composition layer (new)

A new `apps/registry` (Next.js) emits static registry JSON via `shadcn build` to `/r/*.json`, deployed to willink infra (e.g. `registry.i-willink.com`). It declares an `@willink` namespace. Distribution is **public MIT** (consistent with the public-npm posture); the `components.json` `registries` Bearer-auth path is held in reserve for any future product-proprietary block, with no re-architecture required.

- **Blocks are `registry:block` items carrying composition only.** Each block's `registryDependencies` point at the existing npm primitives **by name** (e.g. a contact-form block depends on Button/Input/FormField) — blocks do **not** re-vendor primitives, and they inherit token theming for free. First blocks: the ClubLink organisms (`@willink/contact-form`, `@willink/page-hero`) plus `auth-form`, `app-shell`, `settings-page`, `pricing-section`.
- **Token delivery is via the preset, not duplicated.** Each block declares `@willink-labs/tailwind-preset` as a dependency and documents `@import preset.css`, so the OKLCH single-`--color-brand`-override system ([ADR-0013](./0013-dark-mode.md)) is reused verbatim — **one** token source of truth. A `registry:theme` item (`willink-theme`) ships **only as an escape hatch** for pure-CSS / WordPress consumers who refuse any npm CSS dependency (the same rationale `@willink-labs/css-tokens` already exists for). Inlining the color-mix derivation into `cssVars` is rejected: it creates a second token source that drifts (the exact failure class ADR-0013's byte-identical-blocks rule prevents).
- **A registry-build guard** (analog of `packages/react/scripts/check-dist-use-client.mjs`) asserts copied client-component source retains its `'use client'` directive, so the #54 defect class cannot re-enter via copied files.

### 3. Templates — GitHub template repos (not registry items)

Whole-app starters ship as **GitHub template repos** (cloned via `degit` / `create-next-app -e`), each pre-wiring `@willink-labs/* ^1.x`, the single preset `@import`, the `data-theme` dark contract, and a `components.json` with the `@willink` registries entry — so the new-product bootstrap is `degit <starter>` then `npx shadcn add @willink/<block>`. Two starters map to the two real consumers: a ClubLink marketing site and an i-willink.com app-shell. `registry:page` items are reserved for route-level scaffolds dropped into an *existing* app.

## Consequences

- **Net model**: primitives = npm (central, versioned, import-and-run); composition = public-MIT shadcn registry (copy-to-own blocks, `registryDependencies` → npm primitives); whole apps = template starter repos. No new licensing model (MIT throughout, internal self-products).
- The only genuinely new infrastructure is `apps/registry`; everything else extends what exists. The token layer is shared, so a block copied from the registry themes identically to an npm-imported primitive.
- Cost: a second distribution surface to keep working. Mitigated by the registry-build `'use client'` guard and by blocks depending on (not re-vendoring) primitives.
- Follow-ups (separate ADRs / issues): the Tailwind-like extension surface ([ADR-0021](./0021-extension-contract.md): published `@theme` override contract + `@layer components` + dark `@custom-variant`); the `apps/registry` scaffold; the first blocks and template repos.
