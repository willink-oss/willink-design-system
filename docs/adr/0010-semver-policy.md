# ADR-0010: SemVer policy after v1.0.0

- **Status**: Accepted
- **Date**: 2026-05-17
- **Phase**: 9.5 (v1.0.0 release prep — adopter contract)

## Context

Through `0.x` the DS used the **0.x semver convention** spelled out in every CHANGELOG ("minor bumps may include breaking changes; pin with `~0.N.0` for exact-minor stability"). This let the project move fast — `0.8.0` removed the brand axis machinery, `0.11.0` rewired the brand scale, `0.12.0` rewired the motion utilities — without burning adopters with major bumps every two weeks.

`v1.0.0` is different. It is the API freeze. Adopters reading "1.0.0" reasonably expect that future minor / patch releases will not break their code, and that breaking changes require a major version bump. The DS has to commit to that contract or the "1.0" signal is misleading.

This ADR pins down what counts as MAJOR / MINOR / PATCH after `v1.0.0` for each package surface — so that future PR reviewers, release-cut authors, and adopters all read the same rule book.

## Decision

After `v1.0.0` the npm packages (`@willink-labs/tokens`, `@willink-labs/tailwind-preset`, `@willink-labs/react`, `@willink-labs/css-tokens`) follow strict [SemVer 2.0.0](https://semver.org/), with the per-package interpretation below.

### `@willink-labs/tokens`

The package's public surface is the **shape and keys of `primitive.json` and `semantic.json`**, plus the `tokens` TypeScript re-export from `src/index.ts`.

| Change | Version bump |
|---|---|
| Add a new primitive (e.g. a new brand scale step like `1000`, a new color group) | MINOR |
| Add a new semantic role (e.g. a new `motion.modal-tween-enter`) | MINOR |
| Add `$description` / metadata to existing leaves | PATCH |
| Change a primitive value (e.g. swap `--color-brand-600` to a different hex) | **MAJOR** — the value is the visual baseline; downstream tests / screenshots break |
| Rename or remove a primitive or semantic key | **MAJOR** |
| Change a semantic alias target (e.g. `motion.modal-enter` → `{duration.base}` instead of `{duration.fast}`) | **MAJOR** — adopter-visible behavior change |

### `@willink-labs/tailwind-preset`

Public surface: the `@theme` CSS variable names declared in `preset.css`, the `@utility` rule names, the `@source inline()` safelist entries, and the `preset.css` / `safelist.css` import paths.

| Change | Version bump |
|---|---|
| Add a new `@utility` (e.g. `animate-fade-down`) | MINOR |
| Add a new `--variable` in `@theme` (e.g. `--duration-popover-enter`) | MINOR |
| Tweak a keyframe internal so the visual feel changes but the public utility name is unchanged | MINOR (adopters who care can opt-out via `:root` override) |
| Rename `--variable` or `@utility` | **MAJOR** |
| Change the value an existing semantic CSS variable resolves to (e.g. `--duration-modal-enter` → `var(--duration-slow)`) | **MAJOR** |
| Change Tailwind v4 → v5 peer dependency | **MAJOR** |
| Bug fix that does not change any public surface | PATCH |

### `@willink-labs/react`

Public surface: every export in `packages/react/src/index.ts` — components, types, and utility helpers (`cn`, `cva` re-exports). Component prop names, types, and defaults are part of the contract; internal `cva` variant strings are not.

| Change | Version bump |
|---|---|
| Add a new component, prop, or variant | MINOR |
| Add new exports to `src/index.ts` (e.g. expose an internal helper) | MINOR |
| Change a default prop value | MINOR (visually surprising but compile-safe) — flag in CHANGELOG migration table |
| Change a component prop type (narrow, widen, remove) | **MAJOR** |
| Rename or remove an export | **MAJOR** |
| Change a component's a11y semantics (ARIA role, label, focus order) | **MAJOR** — adopter accessibility audits break |
| React 19 → React 20 peer | **MAJOR** |
| Tailwind v4 → v5 peer | **MAJOR** |
| Bug fix that does not change the public surface | PATCH |

### `@willink-labs/css-tokens`

Public surface: the three exported CSS files (`tokens.css` / `tokens.scale.css` / `tokens.semantic.css`) and the set of `--variable` names they declare.

| Change | Version bump |
|---|---|
| Add a new `--variable` | MINOR |
| Rename or remove a `--variable` | **MAJOR** |
| Change a primitive value (the i-willink baseline hex shifts) | **MAJOR** |
| Generator-only changes that do not alter output | PATCH |

## Out of scope for SemVer

- **Internal CVA variant strings** in `@willink-labs/react`. Adopters should not be sniffing `Button` class names; if they do (e.g. via `[class*="bg-brand"]` selectors), that is consumer-side coupling and the DS does not promise stability.
- **DTCG JSON file location.** `primitive.json` / `semantic.json` are imported via `@willink-labs/tokens` exports — those export paths are part of the contract; the directory layout under `src/` is not.
- **Build output paths in `react`.** `dist/index.js` is named via `publishConfig.exports`; if `tsup` changes file naming, that is internal as long as the `exports` map keeps pointing to the right files.

## Process

1. **Every PR** lists its SemVer impact (`MAJOR` / `MINOR` / `PATCH`) in the PR description, citing the relevant row in this ADR.
2. **Every CHANGELOG entry** under `## [1.x.y]` follows Keep-a-Changelog with the same three categories: `Added` (MINOR), `Changed` / `Deprecated` / `Removed` (MAJOR), `Fixed` (PATCH).
3. **Major version bumps** require an adopter migration guide under `docs/MIGRATION-{from}-to-{to}.md` (the v1.0.0 cut ships [`docs/MIGRATION-0.8-to-1.0.md`](../MIGRATION-0.8-to-1.0.md) as the template).

## Consequences

### Positive
- Adopters can `pnpm add @willink-labs/react@^1.0.0` and trust that minor / patch updates do not break their code.
- PR reviewers have a single rule book to point at when deciding the version bump.
- The DS is forced to think before changing a primitive value or a default — those are MAJOR, not "let's quietly bump 1.4.7".

### Negative
- The DS team has to be more deliberate about bumps. A drive-by hex tweak to `--color-brand-600` is no longer a free patch.
- Some judgement calls remain — e.g. "is reordering the items in a `Select` default focus stop a MAJOR a11y change?" — this ADR sets the policy but PR review has to apply it case-by-case.

### Neutral
- The `0.x` semver convention used until `v0.13.0` is grandfathered. CHANGELOG entries for releases before `1.0.0` continue to read "minor bumps may include breaking changes; pin with `~0.N.0`". Adopters upgrading across the `0.x → 1.x` boundary read [`docs/MIGRATION-0.8-to-1.0.md`](../MIGRATION-0.8-to-1.0.md).

## Related

- [`docs/MIGRATION-0.8-to-1.0.md`](../MIGRATION-0.8-to-1.0.md) — the adopter-facing artifact this ADR underpins
- ADR-0011 — `willink_theme` versions independently from the npm packages
- SemVer 2.0.0 — https://semver.org
