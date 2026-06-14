# ADR-0019: Beta channel & release isolation — making pre-releases safe to cut (incl. by automation)

- **Status**: Accepted
- **Date**: 2026-06-14
- **Phase**: v1.8 cycle (release governance — supervised automation onboarding)

## Context

This design system ships to production consumers. Two of them run live (a marketplace web app on the `@willink-labs` React/preset packages, and a media site), so an incorrect publish to the `latest` dist-tag is a same-day production incident — not a staging inconvenience. Every npm tag publishes irreversibly via OIDC ([ADR-0007](./0007-oidc-trusted-publisher.md)); npm's 24h unpublish window exists but the industry-standard recovery is a forward patch, not a retraction ([ADR-0012](./0012-release-verification-policy.md) Layer 2).

We want to widen how change reaches the system — including a **human-supervised automation loop** that opens draft PRs and, once an independent checker confirms the executable Definition-of-Done ([ADR-0012](./0012-release-verification-policy.md) Layer 0/1) and CI is green, can land the change and **cut a pre-release without waiting on a human**. That is only acceptable if a pre-release **physically cannot reach a consumer who did not opt in**. Before this ADR, it could: `publish.yml` triggered on every `v*` tag and ran `pnpm publish` with no `--tag`, which defaults to `latest`. A `v1.8.0-beta.0` tag would have shipped to `npm i @willink-labs/react`.

So the prerequisite for *any* autonomy is a verified isolation boundary. This ADR defines it.

## Decision

### 1. Two release channels per registry

| Registry | Stable (production) | Pre-release (opt-in) |
|---|---|---|
| **npm** (`tokens` / `tailwind-preset` / `css-tokens` / `react`) | dist-tag `latest` — what a bare `npm i @willink-labs/<pkg>` resolves | dist-tag `beta` / `rc` / `alpha` / `next` — reached **only** via `npm i @willink-labs/<pkg>@beta` |
| **pub.dev** (`willink_theme`) | a stable SemVer `X.Y.Z` | a pre-release SemVer `X.Y.Z-beta.N` — pub.dev **excludes pre-releases from default `^`-constraint resolution**, so existing consumers never auto-upgrade to it |

The channel is derived from the SemVer string, not configured per-release: a version containing a `-` (a SemVer pre-release) is a pre-release; everything else is stable. `publish.yml` computes the npm dist-tag from the version and passes it to every `pnpm publish --tag`.

### 2. Three guards (a wrong publish fails loudly, never silently ships)

1. **Tag/manifest agreement** — the tag version must equal `packages/react/package.json` (canonical for the lockstep npm group) / `pubspec.yaml` for Flutter. Automates [ADR-0012](./0012-release-verification-policy.md) Layer 2 #1; a mismatched tag aborts the job.
2. **Pre-release never resolves to `latest`** — an explicit assertion in `publish.yml`, independent of the channel-derivation logic (defense in depth).
3. **No silent regression** — `pnpm guardrails` (`scripts/check-guardrails.mjs`, run in CI and again inside `publish.yml`) asserts the isolation markers still exist in `publish.yml`. Deleting the isolation fails the gate.

### 3. What automation may and may not do

A supervised automation loop may, on its own, **after** an independent checker confirms the executable DoD and CI is green:

- **merge** the draft PR it opened, and
- **cut a pre-release** (`vX.Y.Z-beta.N`, and `flutter-vX.Y.Z-beta.N` when Flutter changed).

It may **never**:

- **promote to stable.** A `vX.Y.Z` / `flutter-vX.Y.Z` tag (the `latest` channel = user delivery) is **human-only** — beta→stable promotion is always a human gate. This is unchanged by autonomy.
- **invent its own work.** It only acts on issues a maintainer has explicitly approved.
- **first-publish a package as a pre-release.** npm bootstraps a `latest` dist-tag onto a package's *very first* published version even under `--tag beta` (a package must have a `latest`). So a brand-new package's first release is a hand-cut **stable** — and adding a new package is new public surface (human-only) regardless. `publish.yml` enforces this: a pre-release publish aborts if any target package has no existing npm version.
- run if isolation is unverified. The `beta` channel being ignored by every default install path must be empirically confirmed (publish a beta, then check `npm view <pkg> dist-tags.latest` is unchanged and `@latest` still resolves to the prior stable) before the loop is allowed to release.

Pre-releases carry AI-authored content (e.g. generated copy, translations); its quality is absorbed at the **human stable-promotion gate**, which is exactly why that gate stays human-only.

### 4. Consumer guidance

```bash
# production (default) — always a hand-cut stable release
npm i @willink-labs/react

# preview the beta channel — opt-in, may contain unreviewed automated changes
npm i @willink-labs/react@beta
```

`willink_theme` (Flutter) beta consumers pin the pre-release explicitly in `pubspec.yaml` (e.g. `willink_theme: 1.6.0-beta.1`); a normal `^1.5.0` constraint stays on stable.

## Consequences

- Pre-releases (human- or automation-cut) are safe: they cannot reach a default install.
- Stable releases are unchanged — same lockstep cut, same human gate, same [ADR-0012](./0012-release-verification-policy.md) verification.
- The isolation is enforced by CI, not convention, so it survives refactors of `publish.yml`.
- A new, auditable surface exists: the `beta` dist-tag and pre-release tags. Anyone can inspect what automation shipped (`npm view @willink-labs/react versions`, the `beta` dist-tag, and the open/merged PR history) without privileged access.
- Cost: a second publish path to keep working. Mitigated by guard #3 (the gate breaks if it rots) and by the channel being derived from SemVer rather than hand-maintained.
