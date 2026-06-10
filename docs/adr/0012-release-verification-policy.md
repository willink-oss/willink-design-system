# ADR-0012: Release verification policy — what must be verified, by change type

- **Status**: Accepted
- **Date**: 2026-06-11
- **Phase**: post-v1.1 quality governance

## Context

Through the v1.1 cycle (2026-06) the *de facto* verification practice diverged by change type, and each divergence caught something the uniform CI gate alone would not have:

- The dependabot **sonner 2.0 major bump** (#4) passed dependabot's own checks but broke the dts build — and even after fixing the build, the real question was semver: sonner had *removed* two props from our frozen `Toaster` surface. The answer required a **d.ts diff against the published package** (`npm pack @willink-labs/react@1.0.0` + diff) and an upstream-type diff (sonner 1.7.4 vs 2.0.7), not a test run. The migration shipped as a compat shim classified MINOR (#30).
- The **Storybook a11y pass** (axe via `@storybook/addon-a11y`) found a real component bug the unit suite had missed for months: single-thumb `Slider` had no accessible name (#38). Story authoring is a verification activity, not just documentation.
- The four **Flutter components** (#32 #33 #39 #40) each required the same three commands (`flutter analyze` / `flutter test` / `dart pub publish --dry-run`) plus a ColorScheme-override test proving consumer `copyWith` flows through — a check unique to the theming contract.
- The **release cut** (#41) required a full local gate *before* tagging, because tags publish irreversibly via OIDC; CI green on the PR is necessary but not sufficient evidence that versions, CHANGELOGs, and READMEs agree (the flutter README was about to ship 1.4.0 documenting an API removed in 0.5.0).

None of this was written down. This ADR codifies the per-change-type verification matrix so future PRs — human- or agent-authored — run the right checks without rediscovering them.

## Decision

### Layer 0 — uniform CI gate (every PR, no exceptions)

`quality-gate` + `flutter-gate` as defined in `.github/workflows/ci.yml`:
`pnpm guardrails` · `pnpm -r test` · `pnpm -r build` (includes playground **and** storybook builds) · `pnpm audit --prod --audit-level=high` · `flutter analyze` · `flutter test` · `dart pub publish --dry-run`.

Layer 0 is the floor. The matrix below adds on top of it.

### Layer 1 — by change type

| Change type | Required verification beyond Layer 0 | SemVer guidance |
|---|---|---|
| **Token change** (`primitive.json` / `semantic.json`) | `tokens` unit tests + Flutter `tokens_sync_test.dart` both updated in the same PR (cross-language drift guard); visual check in playground or storybook | Value change = MAJOR + Governance Level 3 (CEO); new key = MINOR — per [ADR-0010](./0010-semver-policy.md) |
| **React component — new** | Component checklist in `CONTRIBUTING.md` (unit tests incl. `jest-axe`, safelist, CHANGELOG, playground demo) **+ a story in the same PR** + a row in [`docs/a11y/matrix.md`](../a11y/matrix.md) | MINOR |
| **React component — modified** | Affected unit tests; **story and a11y-matrix row updated if props / variants / a11y semantics moved**; if the public type surface may have moved: d.ts diff vs the last published version (`npm pack @willink-labs/<pkg>@latest`, diff against fresh `dist/index.d.ts`) with the classification stated in the PR | Per ADR-0010 table |
| **Dependency bump — devDependency / CI action** | Layer 0 only (this is the dependabot auto-merge path) | No release impact |
| **Dependency bump — runtime, MINOR/PATCH** | Layer 0; if the dependency's types flow through our public surface (Radix, sonner, lucide, cva), a d.ts diff vs published | Usually PATCH |
| **Dependency bump — runtime, MAJOR** | **Never auto-merge.** Dedicated migration PR with: (1) upstream type diff (old vs new dep `.d.ts`), (2) our d.ts diff vs published, (3) explicit ADR-0010 classification in the PR body, (4) compat-shim evaluation for anything the upstream removed from our frozen surface. Template: the sonner migration (#30). | Decided by the diff, not the dep's own major |
| **Flutter component — new/modified** | The 7-test pattern (`willink_button_test.dart` groups), an explicit `copyWith(colorScheme:)` override test, independent `willink_theme` version bump + CHANGELOG section ([ADR-0011](./0011-flutter-independent-versioning.md)) | Independent MINOR/PATCH |
| **Docs-only** | Layer 0 (cheap); links resolve | No version bump |
| **Tooling (`apps/`, workflows, scripts)** | `pnpm guardrails` forbidden-list; **same-PR-content rule** — tooling lands with at least one productive artifact (story, component, token); the tool's build participates in `pnpm -r build` so CI exercises it forever | No version bump |
| **Release cut** | See Layer 2 | — |

### Layer 2 — release cut (tags publish irreversibly)

Before pushing any tag, the release author runs the **full local gate** on the merged main commit (or the release PR branch at parity with it): every Layer 0 command, locally, plus:

1. **Version/document agreement**: `package.json` × CHANGELOG top section × README claims all state the same reality. READMEs are release artifacts — pub.dev and npm render them; a stale README is a shipping bug, not a docs nit.
2. **CHANGELOG completeness**: `[Unreleased]` is empty after the cut; lockstep packages without source changes carry an explicit lockstep-marker entry, not silence.
3. **Atomic tag push** per the runbook: all tags for one release event (`vX.Y.Z`, `flutter-vX.Y.Z`) pushed in one `git push origin tag1 tag2`.
4. **Post-publish verification**: `npm view <pkg> version` for each package and the pub.dev API for `willink_theme`, plus publish-workflow conclusion — *before* announcing or drafting GitHub Releases.

### Evidence convention

Every PR body carries a **Verification** section listing the commands run and their outcomes (counts, "No issues found", dry-run warnings with explanations). CI re-runs the gate; the section exists so a reviewer can see what was checked *beyond* the gate and so the release history is auditable. A claim without a command behind it does not belong in the section.

## Consequences

- Dependabot stays useful for the cheap 80% (dev deps, actions, runtime minors) while runtime majors get a documented, repeatable migration playbook instead of ad-hoc judgment.
- Story coverage is now load-bearing: the a11y addon runs axe on every story, so "add the story in the same PR" is a test requirement, not a documentation courtesy. Skipping it loses a verification layer that has already caught a shipped WCAG violation.
- The release cut gets slower by one local full-gate run (~3 min npm + ~1 min Flutter). That is the price of irreversible OIDC publishes; we pay it.
- The matrix is enforceable by review (and by agents following this document), not by CI alone. If a row proves chronically skipped, the follow-up is to automate that row, not to delete it.
