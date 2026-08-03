# ADR-0022: PULSE supersedes `willink_theme` as the Flutter design system

- **Status**: Accepted
- **Date**: 2026-08-03
- **Supersedes**: the Flutter half of [ADR-0011](./0011-flutter-independent-versioning.md) (the independent-versioning mechanism it describes is unchanged; only the package it applies to moves)

## Context

`packages/flutter_theme` (published as `willink_theme`) was this monorepo's Flutter binding: a Material 3 `ThemeData` factory plus nine components, versioned independently from the npm group ([ADR-0011](./0011-flutter-independent-versioning.md)) and last released as 1.5.0 on 2026-06-11.

Since then the Flutter work moved to its own repository, [`willink-oss/pulse_theme`](https://github.com/willink-oss/pulse_theme) — PULSE — which publishes `pulse_theme` to pub.dev. PULSE is not a rename. It is a **mobile-first** design system: components are designed for touch-first, app-shaped UI rather than ported down from a desktop web system, and it carries decisions `willink_theme` never had (a semantic radius layer, a 48dp tap-target contract, golden/visual-regression coverage, a documented stability policy).

Critically, PULSE consumes the **same** token source of truth. Its Dart token classes are code-generated from the published `@willink-labs/tokens` DTCG JSON — the same contract `tailwind-preset`, `css-tokens`, and `react` read. So the two systems were never divergent designs; they were one design with two homes for its Flutter binding.

Leaving both published is the actual problem, and it has already produced the failure it predicts:

- Two Flutter packages on pub.dev both claim to be i-Willink's design system, with no machine-readable signal which one to adopt. An outside consumer picking `willink_theme` today picks a package that will not receive the next token change.
- This repository's own README listed `willink_theme` as the Flutter package with no mention of PULSE at all, while `SECURITY.md` had already been updated to say PULSE supersedes it. A repo that contradicts itself about what it ships is worse than one that is merely out of date.
- Every token change now has to be applied twice or it silently isn't. `willink_theme` hand-mirrors its tokens (`packages/flutter_theme/lib/src/tokens/primitive.dart`); PULSE generates them and gates on drift. The mirror is exactly the class of defect the codegen was introduced to kill.

## Decision

**PULSE (`pulse_theme`) is the Flutter design system. `willink_theme` is discontinued.**

1. **`willink_theme` is marked discontinued on pub.dev.** pub.dev has no "deprecated" state for a version; discontinuation is a package-level flag set from the package's admin page, which surfaces a banner and excludes it from search. That is a manual, human action — it cannot be automated from CI, and this ADR does not pretend otherwise.
2. **No further feature releases.** The `flutter-vX.Y.Z` tag path stays wired so a **security-only** patch to 1.5.0 remains possible, and nothing else ships from it.
3. **`packages/flutter_theme` stays in-tree, for now.** Deleting it would erase the history that makes the migration guide checkable, and would collide with in-flight work. Removal is a separate, later decision once no consumer resolves it — deliberately not bundled into this one.
4. **Docs point one way.** README, CONTRIBUTING, and SECURITY name PULSE as the Flutter path. Historical records — roadmaps, prior ADRs, CHANGELOGs — are **not** rewritten: they record what was true when written, and editing them would destroy the audit trail this repo's release-verification policy ([ADR-0012](./0012-release-verification-policy.md)) depends on.
5. **The token contract does not move.** `@willink-labs/tokens` remains the single source of truth, published from this repository. PULSE is a consumer of it, exactly as the npm packages are.

### Why PULSE also publishes an npm package

PULSE ships a second binding, `@willink-labs/pulse`, from the PULSE repository: the same tokens as `--pulse-*` CSS custom properties, for Next.js, Electron, and plain-CSS consumers.

That is a `@willink-labs`-scoped package **not** built in this monorepo, which is worth stating plainly because it looks like a mistake. It is not. It carries PULSE's own semantics — the radius roles (`control` / `surface` / `sheet` / `pill` / `inset`) and the tap-target minimum — which exist in no token contract to generate from. Those decisions belong to PULSE, so both of PULSE's bindings ship from one repo on one tag, with a cross-binding parity test proving the Dart and the CSS agree value-for-value.

It does **not** replace [`@willink-labs/css-tokens`](../../packages/css-tokens), which remains the flat projection of the raw contract and the official WordPress consumption path ([ADR-0014](./0014-wordpress-consumption.md)). The two coexist in one document: PULSE prefixes every property with `--pulse-`.

## Consequences

- **A Flutter consumer must migrate.** `willink_theme` will not receive token changes. The API mapping is mechanical (`Willink*` → `Pulse*`, `WillinkTheme.willink()` → `PulseTheme.light()`); [the migration guide](../MIGRATION-willink-theme-to-pulse.md) covers the cases that are not.
- **One token change now reaches every platform from one regenerate** — web via the npm group, mobile via PULSE's Dart codegen, and non-Tailwind web via either `css-tokens` or `@willink-labs/pulse`. No hand-mirroring survives.
- **This repository is now npm-only.** Its release process still has two channels on paper (`ADR-0011`), but the second one is dormant rather than active. When `packages/flutter_theme` is eventually removed, ADR-0011 becomes historical in full.
- **The discontinuation is not effective until a human sets the pub.dev flag.** Until then both packages remain equally installable, and this ADR is a statement of intent rather than an enforced state. That gap is the honest status, and it is the one step of this decision no gate can hold.
