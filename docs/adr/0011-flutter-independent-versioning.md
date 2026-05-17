# ADR-0011: `willink_theme` versions independently from the npm packages

- **Status**: Accepted
- **Date**: 2026-05-17
- **Phase**: 9.5 (v1.0.0 release prep — release-cadence contract)

## Context

The four npm packages (`@willink-labs/{tokens,tailwind-preset,react,css-tokens}`) ship in lockstep — one PR bumps all four, one git tag publishes all four atomically. This is mechanically enforced by `publish.yml`, which runs `pnpm -F <pkg> publish` for each in sequence and uses the workspace's lockfile to confirm they all carry the same `version` field at tag time.

`willink_theme` (pub.dev) lives in the same monorepo (`packages/flutter_theme`) but ships through a separate `publish-flutter.yml` workflow triggered by `flutter-v*` tags. The two release channels are mechanically independent — npm publishes do not require pub.dev publishes, and vice versa.

At `v0.13.0` the version-number coincidence has already been broken: the npm packages are at `0.13.0`, `willink_theme` is at `0.5.0`. The single-brand baseline pivot (`d8a78e0` / `0.8.0` for npm + `flutter-v0.5.0` for Flutter) was the inflection point. There has been no need to bring the Flutter version line back up to `0.13.0` — the Flutter package has not had eight `0.6.0..0.13.0` worth of additions to track. Forcing a `flutter-v0.13.0` "lockstep catch-up" tag would publish a release with no content.

This ADR makes the existing practice explicit.

## Decision

**`willink_theme` versions independently from the npm packages.** Its release cadence, semver counter, and CHANGELOG track its own surface (Material 3 `ThemeData`, component widgets, token sync tests). The version-number coincidence at `v1.0.0` (Phase 9.6 bumps both groups to `1.0.0`) is a one-time marker, not a coupling commitment.

After `v1.0.0`:
- The npm group continues to lockstep. `tokens@1.5.0` ⇒ `tailwind-preset@1.5.0` ⇒ `react@1.5.0` ⇒ `css-tokens@1.5.0`, always.
- `willink_theme` ticks at its own pace. `flutter-v1.1.0` might land while npm is still at `1.0.x`, or vice versa.
- The two version lines have no must-match constraint.

### Why npm packages stay locked but Flutter floats

The npm packages share a TypeScript type system, a peer-dependency on Tailwind v4, and a workspace lockfile. A `tokens@1.5.0` change is consumed transitively by `react`, and `react` ships a tarball whose `peerDependencies` resolves `tokens@workspace:*` to a literal version at publish time. Lockstep guarantees that the resolution always picks the version that was tested together.

`willink_theme` is a Dart package. It has its own dependency graph (no link to the npm graph) and consumes the DS via a different vehicle — `tokens_sync_test.dart` reads the **DTCG JSON files directly** from the monorepo, not the published npm package. The pub.dev consumer never reaches into the npm registry. There is no failure mode where a Flutter consumer ends up with a "wrong combination" of npm versions.

### What this means for adopters

- **Pinning**: pin npm packages with `^1.0.0` for normal MINOR-safe upgrades. Pin `willink_theme` with `^1.0.0` separately.
- **Migration guides**: the npm migration guide (e.g. `docs/MIGRATION-1.0-to-2.0.md` at the next major) and the Flutter migration guide are separate documents. They may cross-reference but they have separate audiences.
- **Token drift**: the `tokens_sync_test.dart` in `packages/flutter_theme/test` reads `packages/tokens/src/{primitive,semantic}.json` at CI time. If the npm side adds a new primitive without a parallel Flutter consumption, the sync test stays green (Flutter does not have to consume every primitive). If the npm side renames or removes a primitive that Flutter consumes, the sync test fails — that is the wire that triggers a Flutter PR.

### What about the v1.0.0 coincidence

Phase 9.6 of the v1.0 release roadmap intentionally bumps both groups to `1.0.0` in the same release PR. This is a **storytelling decision**, not a coupling commitment:
- Adopters reading "i-Willink Design System 1.0" should see a coherent first-stable marker across both stacks.
- The release notes can describe one "API freeze" moment instead of two.
- After the cut, the two lines diverge again as before.

The CHANGELOG entries at `1.0.0` say so explicitly:
- npm packages: `1.0.0 — lockstep API freeze (Phase 9.6 release cut)`
- `willink_theme`: `1.0.0 — coincidence marker; future minors track Flutter cadence per ADR-0011`

## Rationale

### Why not also lockstep Flutter

Considered and rejected:
- `tokens_sync_test.dart` already protects against the only failure mode lockstep was solving. The test runs in `publish-flutter.yml` and fails the pub.dev publish if Flutter is consuming a primitive the npm side renamed.
- Forcing a `flutter-v0.13.0` "catch-up" publish that adds no value would erode adopter trust in version numbers ("0.13 to 0.14 is empty? Why?").
- The Flutter version number tells the Flutter consumer what they get. The npm version number is irrelevant to them.

### Why not strictly decouple the v1.0.0 marker too

Considered and rejected:
- Adopters in mixed environments (e.g. a marketing landing page on Next.js + a native app on Flutter) read the DS as one system. Aligning the `1.0` moment is cheap (single commit) and pays back in clarity of the release-notes story.
- Diverging from `0.x` directly into `flutter-v1.0.0` at a different time creates two announcements, two "what does 1.0 mean for me" Q&A loops.

## Consequences

### Positive
- Honest version numbers: each line increments only when its surface changes.
- No empty catch-up tags. No "what did 0.7.x add to Flutter?" confusion.
- Token drift is mechanically caught by `tokens_sync_test.dart`; no human policy needed.
- Adopter migration guides stay focused (no "this minor bump is npm-only" footnotes everywhere).

### Negative
- Cross-pkg references are harder to write. "DS 1.5" is ambiguous — is that the npm packages or Flutter? In practice we always say "react 1.5" or "willink_theme 1.5" explicitly.
- The version-coincidence at `v1.0.0` invites confusion ("does Flutter follow npm version forever?"). Documented in this ADR and called out in the `v1.0.0` CHANGELOG entries.

### Neutral
- `publish.yml` and `publish-flutter.yml` remain separate workflows. No change.
- The monorepo still has both packages in `packages/`. Cross-package work is still possible in a single PR (e.g. a primitive rename touches both).

## Related

- ADR-0010 — SemVer policy after v1.0.0 (applies to both groups, but the version counters are independent)
- `packages/flutter_theme/test/tokens_sync_test.dart` — the mechanical check that supersedes lockstep
- `.github/workflows/publish-flutter.yml` — independent release workflow
- `docs/roadmap/v1.0.md` Phase 9.6 — the one-time v1.0.0 coincidence
