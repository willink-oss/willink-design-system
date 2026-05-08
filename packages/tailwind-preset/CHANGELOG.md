# Changelog

All notable changes to `@willink-labs/tailwind-preset` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.2.0` for exact-minor stability).

## [0.4.0] — 2026-05-08

### Added — `@source` is now automatic
- New `safelist.css` (auto-imported from `preset.css`) lists every DS
  component class via Tailwind v4's `@source inline()` directive. Because
  `@source inline()` takes class names rather than filesystem paths, the
  registration is portable across pnpm symlinks, npm tarballs, and
  Turborepo hoisting — the precise failure mode that caused the 5/8 P0
  regression on clublink.jp.
- `safelist.css` is also exposed via `package.json` `exports` so consumers
  can import it directly if they ever need the safelist without the rest
  of the preset.

### Changed — consumer setup is now one line
- `README` Quick Start: removed the two `@source ".../node_modules/..."`
  lines. The only required entry in the consumer's CSS is now:
  ```css
  @import "@willink-labs/tailwind-preset/preset.css";
  ```
- `preset.css` opening comment rewritten to reflect the one-line setup
  and to point at `safelist.css` for the maintenance contract.

### Backwards compatible
- Consumers that still have the legacy `@source` lines from 0.3.x will
  continue to build successfully — Tailwind treats duplicate registrations
  as idempotent. We will remove those lines from clublink-platform and
  i-willink.com in follow-up consumer PRs.

### Why this approach (not a JS plugin)
- The 0.3.0 changelog promised a "Tailwind v4 plugin that registers content
  paths via the JS plugin API". Tailwind v4's documented plugin surface
  does not expose programmatic content-path registration; the `@plugin`
  directive only loads legacy v3-style plugins. `@source inline()` (a CSS
  directive) is the v4-native mechanism for forcing class compilation, and
  it solves the path-portability problem that blocked the 0.3.0-rc embed.

### Lockstep version bump
- Bumped together with `@willink-labs/tokens@0.4.0` and `@willink-labs/react@0.4.0`
  to keep the three DS packages versioned as a single unit.

## [0.3.0] — 2026-05-08

### Documentation
- **Setup is now documented**. Consumers must add two `@source` lines next
  to their `@import` of `preset.css` so Tailwind v4 will scan the DS
  React-component built sources for cva-emitted classes. See README
  "Required @source setup" — without these lines, components render
  with no brand colors / shadows / borders in production. This caused
  a P0 regression on clublink.jp on 2026-05-08 (hotfixed same day in
  clublink-platform PR #19).

### Why this is documentation, not a code fix
A code-side fix attempted to embed the `@source` lines inside `preset.css`
itself (so consumers would only need the single `@import`), but the
relative-path resolution semantics are not portable across pnpm symlinks
and published npm tarballs. The fragile embed was reverted before publish.
A proper fix will land in `0.4.0` as a Tailwind v4 plugin that registers
content paths through the JS plugin API.

### Lockstep version bump
Bumped together with `@willink-labs/tokens@0.3.0` and `@willink-labs/react@0.3.0`
to keep the three DS packages versioned as a single unit.

## [0.2.7] — 2026-05-08

Initial public release on npmjs.org via OIDC Trusted Publisher. No CSS changes
versus 0.2.0 — the version bumps from 0.2.0 → 0.2.7 were all about getting the
publish pipeline working (GitHub Packages → npmjs.org → OIDC). See
`docs/adr/0006-npmjs-migration.md` and `docs/adr/0007-oidc-trusted-publisher.md`
for the full journey.

## [0.2.0] — 2026-05-07

### Added
- Initial token + brand-axis preset (i-willink default + clublink alt brand)
- `@theme` block exposing `--color-{neutral,brand,success,warning,danger}-*`
  primitives plus semantic aliases (`--color-bg`, `--color-fg`, `--color-border`,
  `--color-muted`, `--color-ring`).
- `[data-brand="willink"]` / `[data-brand="clublink"]` switching block.
