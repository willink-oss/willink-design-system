# Contributing to i-Willink Design System

Thanks for your interest in contributing! / コントリビュート歓迎です。

This is the design system that powers i-Willink products (Next.js apps, Flutter apps, WordPress themes). We aim for a small, well-curated component set rather than feature parity with larger systems — quality over coverage.

---

## Project structure

| Package | Role |
|---|---|
| `packages/tokens` | DTCG-compatible JSON tokens (primitive + semantic). Single source of truth. |
| `packages/tailwind-preset` | Tailwind v4 `@theme` preset (willink baseline). Consumers customize via `:root { --color-brand: ... }` override. |
| `packages/react` | shadcn-inspired React components on Radix primitives. 42 components (1.8.0+, Command + NavigationMenu + Menubar added 1.9.0). |
| `packages/flutter_theme` | Material 3 `ThemeData` factory + 9 Flutter components (EmptyState / ErrorState / LoadingState / SectionCard / WillinkButton / TabBar / BottomSheet / SnackBar / ProgressIndicator). Published to pub.dev as `willink_theme`. |

---

## Setup

```bash
pnpm install
pnpm -r build          # build all packages
pnpm -r test           # run all tests
pnpm dev               # start apps/playground for visual verification
pnpm guardrails        # tooling-overhead regression check
```

Flutter package (`packages/flutter_theme`) lives in the same workspace but uses Dart tooling:

```bash
cd packages/flutter_theme
flutter pub get
flutter analyze
flutter test
```

---

## Component guidelines

### Naming / tokens

- **Use semantic tokens only**: `bg-brand`, `text-fg`, `border-border`, `ring-ring`, `text-success` / `warning` / `danger`.
- **shadcn-default names are forbidden**: `bg-primary`, `text-foreground`, `text-muted-foreground`, etc. These are grep-detected by `packages/react/src/lib/check-tokens.test.ts`.
- Brand-axis values (`willink` / `clublink` / `fitai`) are single words — no hyphens (double-click selection / grep ergonomics).

### Radix UI

- Selective import only. Import the specific primitive (e.g. `@radix-ui/react-dialog`), not a monolithic bundle.
- All headless interactions (focus trap, ARIA, keyboard nav) should be delegated to Radix, not reimplemented.

### Component checklist (when adding a new component)

- [ ] Component file in `packages/react/src/<component>/`
- [ ] Unit test with `@testing-library/react` + `jest-axe` (a11y assertion)
- [ ] Safelist update in `packages/tailwind-preset/src/safelist.css` if the component emits new utility class strings
- [ ] CHANGELOG entry in `packages/react/CHANGELOG.md`
- [ ] Playground demo in `apps/playground` so visual regressions are catchable
- [ ] Story in `apps/storybook/src/stories/<component>.stories.tsx` — the addon-a11y axe pass runs per story, so the story is part of the test surface ([ADR-0012](./docs/adr/0012-release-verification-policy.md))
- [ ] Row in [`docs/a11y/matrix.md`](./docs/a11y/matrix.md)

Version bumps happen at release-cut time, not per component PR (see Release process below).

---

## Customizing brand color (consumer-side)

DS is a single-brand baseline (willink purple) as of 0.8.0. Consumers that need a different palette override the CSS variables in their own `globals.css`:

```css
/* consumer/app/globals.css */
@import "@willink-labs/tailwind-preset/preset.css";

:root {
  --color-brand:       #2563eb;
  --color-brand-glow:  #3b82f6;
  --color-accent-cyan: #10b981;
  --color-accent-pink: #059669;
  --shadow-glow:       0 0 20px -5px rgba(37, 99, 235, 0.3);
}
```

Tailwind v4 resolves `:root` overrides at compile time; all DS components pick up the new color without code changes.

Flutter consumers do the equivalent via `ThemeData.copyWith`:

```dart
final theme = WillinkTheme.willink().copyWith(
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
);
```

No PR to this repo is required for consumer-side color overrides. PRs to change the baseline willink palette itself are **Level 3 (CEO approval required)**.

---

## Release process

Two independent release channels ([ADR-0011](./docs/adr/0011-flutter-independent-versioning.md)):

- **npm group** — `tokens` / `tailwind-preset` / `css-tokens` / `react` move in **lockstep**: one release PR bumps all four to the same version; packages without source changes get an explicit lockstep-marker CHANGELOG entry. Tag `vX.Y.Z` publishes all four via OIDC Trusted Publisher.
- **`willink_theme`** — versions independently. Flutter PRs bump `pubspec.yaml` + CHANGELOG per change; tag `flutter-vX.Y.Z` publishes to pub.dev via OIDC Trusted Publisher.

Cut procedure (what must be verified is defined in [ADR-0012](./docs/adr/0012-release-verification-policy.md), Layer 2):

1. Release PR: version bumps + CHANGELOG cuts (`[Unreleased]` → `[X.Y.Z]`) + README freshness check — READMEs are rendered by npm / pub.dev, so a stale README is a shipping bug.
2. Run the **full local gate** before tagging (CI green on the PR is necessary, not sufficient).
3. Rebase-merge the PR; tag the merged commit; push all tags for the release event atomically (`git push origin v1.1.0 flutter-v1.4.0`).
4. Verify post-publish: `npm view <pkg> version` ×4 / pub.dev API, then draft GitHub Releases.

Since v1.0.0 strict SemVer 2.0 applies — classification rules per surface live in [ADR-0010](./docs/adr/0010-semver-policy.md).

### Beta channel & pre-releases

Two channels per registry ([ADR-0019](./docs/adr/0019-autonomous-beta-channel.md)):

- **Stable** (`latest` dist-tag on npm / a stable SemVer on pub.dev) — what `npm i @willink-labs/react` resolves. **Hand-cut and human-gated, always.**
- **Beta** (`beta` dist-tag on npm / a `X.Y.Z-beta.N` pre-release on pub.dev) — opt-in only:

  ```bash
  npm i @willink-labs/react@beta        # npm consumers
  # pubspec.yaml:  willink_theme: 1.6.0-beta.1   # Flutter consumers pin explicitly
  ```

The version string decides the channel: a SemVer pre-release (`X.Y.Z-beta.N`) routes to a non-`latest` dist-tag; `publish.yml` enforces this and refuses to publish a pre-release to `latest`. A normal `^`-constraint never auto-upgrades to a beta.

### Automated contributions (supervised loop)

Some PRs are opened by a human-supervised automation loop. They are held to the **same** [ADR-0012](./docs/adr/0012-release-verification-policy.md) Definition-of-Done as human PRs — an independent checker validates the executable DoD before the PR is eligible to merge. The loop may merge its own PR and cut a **beta** release once the checker passes and CI is green; **promotion to a stable release is human-only.** The loop never invents its own work — it acts only on issues a maintainer has approved.

---

## Pull requests

- Branch off `main`. Branch name: `<type>/<short-description>` (e.g. `feat/dropdown-menu-0.6.0`, `fix/safelist-progress`).
- Conventional Commits prefix: `feat:` / `fix:` / `docs:` / `chore:` / `refactor:` / `test:` / `ci:`.
- One logical change per PR. Rebase-merge keeps the linear history.
- Reference the related Issue (`Closes #N`) if applicable.
- Include a **Verification** section in the PR body: the commands you ran and their outcomes. Which checks are required for which change type is defined in [ADR-0012](./docs/adr/0012-release-verification-policy.md).

---

## Contact

- **Bug reports / feature requests**: [GitHub Issues](https://github.com/willink-oss/willink-design-system/issues)
- **Discussion / questions**: [GitHub Discussions](https://github.com/willink-oss/willink-design-system/discussions)
- **Security vulnerabilities**: see [SECURITY.md](./SECURITY.md) — do **not** open a public Issue for security reports.

No email contact is published. Use GitHub channels above for all communication.

---

By contributing you agree that your contributions will be licensed under the MIT License (see [LICENSE](./LICENSE)).
