# Contributing to i-Willink Design System

Thanks for your interest in contributing! / コントリビュート歓迎です。

This is the design system that powers i-Willink products (Next.js apps, Flutter apps, WordPress themes). We aim for a small, well-curated component set rather than feature parity with larger systems — quality over coverage.

---

## Project structure

| Package | Role |
|---|---|
| `packages/tokens` | DTCG-compatible JSON tokens (primitive + semantic + brand). Single source of truth. |
| `packages/tailwind-preset` | Tailwind v4 `@theme` preset. Switches brand axis via `[data-brand=...]`. |
| `packages/react` | shadcn-inspired React components on Radix primitives. 21 components (0.5.0+). |
| `packages/flutter_theme` | Material 3 `ThemeData` factories + brand axis + 4 Flutter components. Published to pub.dev as `willink_theme`. |

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
- [ ] Version bump in `packages/react/package.json` (lockstep with other packages — see below)
- [ ] Playground demo in `apps/playground` so visual regressions are catchable

---

## Adding a new brand axis

Brand axes are 5-layer aligned. **All five must be updated in the same PR**:

1. **Tokens JSON** — add `packages/tokens/src/brand/<new>.json` + register in `packages/tokens/src/index.ts`.
2. **Tailwind preset BRANDS** — extend `packages/tailwind-preset/src/index.ts` `BRANDS` array.
3. **`preset.css` `[data-brand=<new>]` block** — `packages/tailwind-preset/src/preset.css` brand override block.
4. **`brands/<new>.css` force-mode** — `packages/tailwind-preset/src/brands/<new>.css` for prefers-no-data-attr fallback. Update package `exports` map.
5. **Flutter brand axis** — extend `WillinkBrand` enum + `WillinkTheme.<new>()` factory in `packages/flutter_theme/lib/src/`. Update `test/brand_axis_test.dart` enum count assertion.

Approval: brand-axis addition is **Level 3 (CEO approval required)** — see governance section in root README.

---

## Release process

All 4 packages are released in **lockstep**: tokens / tailwind-preset / react / flutter_theme bump together for any cross-package change.

1. Bump version in each `package.json` and `pubspec.yaml` (same version string).
2. Update each `CHANGELOG.md` with the user-facing change.
3. Open PR; CI must pass (lint / test / build / Flutter analyze).
4. After merge, tag `vX.Y.Z` on `main` — GitHub Actions publishes to npmjs.org (OIDC Trusted Publisher) and pub.dev (OIDC Trusted Publisher). No PAT or `.npmrc` setup needed.

Pre-1.0 (0.x.x): minor bumps may include breaking changes. Pin with `~0.x.0` for exact-minor stability.

---

## Pull requests

- Branch off `main`. Branch name: `<type>/<short-description>` (e.g. `feat/dropdown-menu-0.6.0`, `fix/safelist-progress`).
- Conventional Commits prefix: `feat:` / `fix:` / `docs:` / `chore:` / `refactor:` / `test:` / `ci:`.
- One logical change per PR. Squash on merge.
- Reference the related Issue (`Closes #N`) if applicable.

---

## Contact

- **Bug reports / feature requests**: [GitHub Issues](https://github.com/willink-oss/willink-design-system/issues)
- **Discussion / questions**: [GitHub Discussions](https://github.com/willink-oss/willink-design-system/discussions)
- **Security vulnerabilities**: see [SECURITY.md](./SECURITY.md) — do **not** open a public Issue for security reports.

No email contact is published. Use GitHub channels above for all communication.

---

By contributing you agree that your contributions will be licensed under the MIT License (see [LICENSE](./LICENSE)).
