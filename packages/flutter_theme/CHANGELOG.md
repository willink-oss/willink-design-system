# Changelog

All notable changes to `willink_theme` will be documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.1.0` for exact-minor stability).

## [0.4.0] — 2026-05-14

### Added — WillinkButton component (1 component)

Material 3 brand-aware button with variant / size / icon API:
- variants: `filled` (default) / `outline` / `ghost`
- sizes: `small` / `medium` / `large`
- leadingIcon / trailingIcon support (8px gap)
- fullWidth flag
- automatic disabled state (when `onPressed == null` → opacity 0.5 + no ripple)
- filled variant applies a brand-tinted glow shadow (`colorScheme.primary` at 30% alpha)
- ghost variant uses `primaryContainer` as hover/pressed overlay

Colors derive from `Theme.of(context).colorScheme` so the button follows the
active brand axis (willink / clublink / fitai) automatically.

採用想定先: clubhouse / fit-ai mobile (両者とも willink_theme 0.3.0 main 反映済)。

### Migration from 0.3.x
No breaking changes. Additive release — `WillinkButton` は opt-in。既存 4
components の API は完全互換。

### Verification
- flutter analyze: 0 issues
- flutter test: 39 tests pass (existing 33 + new 7 button tests)
- dart pub publish --dry-run: clean

## [0.3.0] — 2026-05-11

### Added — DS Phase 6 Flutter components (4 件)

最初の component layer。Material 3 theme-aware で全 brand axis (willink /
clublink / fitai) に追従。fit-ai mobile + clubhouse の重複実装
(`EmptyState` / `ErrorState` / `LoadingState` / `SectionCard`) を
willink_theme に一本化し、二重メンテを解消。

- `WillinkEmptyState` — icon + title + description + optional CTA。
  空データ scene 用。色は `colorScheme.onSurfaceVariant` / `outline` で
  自動 brand 追従。
- `WillinkErrorState` — エラー表示 + copy-to-clipboard + retry button。
  `AsyncValue.when` の error branch 用。icon は `colorScheme.error`。
- `WillinkLoadingState` — 3 variants:
  - default (40px): full-screen loading
  - `.compact()` (24px): inline within sections
  - `.inline()` (16px): bare spinner for buttons / list rows / dense layouts
- `WillinkSectionCard` — title + trailing + child の section surface。
  React DS の `Card` compound に相当。Material 3 elevation tint。

### Tests
- 19 widget tests (`test/components_test.dart`) — total 33 pass.
- `flutter analyze`: No issues found.

### Consumer adoption plan
- fit-ai mobile: dashboard (PR #1906 で部分採用) → 段階拡大
- clubhouse: Phase 0 全画面 (single-PR migration 推奨)

### Migration from 0.2.x
No breaking changes. Existing token / theme API 完全互換。
New widgets are opt-in (`WillinkEmptyState` 等を採用したい画面で import)。

## [0.2.1] — 2026-05-09

### Fixed
- `pubspec.yaml`: removed redundant `publish_to: https://pub.dev` (rejected
  by pub.dev with `Invalid 'publish_to' value`). Default is now used.

### Internal
- First release via OIDC Trusted Publisher (publisher: `i-willink.com`).
  All future versions can be released by pushing a `flutter-v{version}` tag.

## [0.2.0] — 2026-05-09

Driven by feedback from the first round of consumer integration (Phase 5.3
fit-ai · Phase 5.4 clubhouse). Both apps had local `AppSpacing` scales and
multiple gradient presets that the 0.1.0 surface did not yet cover.

### Added
- `WillinkSpacing` — Material 3 4-multiple spacing scale
  (xs=4 / sm=8 / md=16 / lg=24 / xl=32 / xxl=48). Importable as
  `WillinkSpacing.md` etc., suitable for `EdgeInsets.all(...)`.
- `WillinkBrandTokens.subtleGradient` — white → brand-50 → sky-50 diagonal,
  mirrors the React preset's `bg-gradient-subtle`. For hero / large-surface
  backgrounds that shouldn't overpower the foreground.
- `WillinkBrandTokens.aiGradient` — cyan → brand-500 → pink, mirrors
  `bg-gradient-ai`. For "AI"-flavored UI moments.

### Changed
- `WillinkBrandTokens` constructor now requires `subtleGradient` + `aiGradient`.
  This is **a breaking change for direct callers** of the constructor. The
  three named presets (`willink` / `clublink` / `fitai`) absorbed the change
  internally, so consumer apps using `WillinkTheme.fromBrand(...)` are
  unaffected. Per the 0.x convention, breaking changes ship in minor bumps.

### Why not TextTheme override / dark factory yet
fit-ai's AppTextStyles (7 sizes, including a non-Material 18px title) does
not map cleanly onto Material 3's TextTheme. We're holding off on adding a
DS-side TextTheme override until we can make the choice well — likely 0.3.0
together with a dark factory, after one more sweep round on fit-ai informs
the canonical scale.

## [0.1.0] — 2026-05-08

Initial scaffold of the Flutter side of the i-Willink Design System.

### License — MIT (differs from npm packages)
This package ships under MIT, distinct from the existing
`@willink-labs/{tokens,tailwind-preset,react}` npm packages which remain
UNLICENSED. Two reasons: (1) pub.dev requires a recognized open-source
license for publish; (2) it aligns with `willink-claude-kit`'s MIT path —
Phase 8 OSS化判断の Flutter 側を前倒しで決めた形。React 側の license 移行は
Phase 8 で別途判断する。

### Added
- `WillinkTheme.fromBrand(WillinkBrand)` factory + three named aliases
  (`willink()`, `clublink()`, `fitai()`).
- `WillinkBrand` enum (3 brands) with `toColorScheme()`.
- `WillinkPrimitives` — Dart constants mirroring
  `@willink-labs/tokens/src/primitive.json`.
- `WillinkSemantics` — semantic mapping (default = i-Willink).
- `WillinkBrandTokens` `ThemeExtension` for non-Material brand tokens
  (`brandGlow`, `brandGradient`, `shadowSoft`, `shadowGlow`).
- `tokens_sync_test.dart` enforcing parity with the canonical DTCG JSON
  (the same single-source-of-truth rule the React side has via
  `check-tokens.test.ts`).
- `theme_data_test.dart` covering each brand's primary color and
  `WillinkBrandTokens` presence.
  intentional exclusion).

### Status notes
- pub.dev publish requires CEO action (org account `willink_labs` setup +
  Trusted Publisher configuration). The included
  `.github/workflows/publish-flutter.yml` is workflow_dispatch-ready once
  that's in place.
  later adopts willink_theme independently, that's a separate downstream
  decision and would not require changes to this package.
- Light mode only at this stage; dark variants will be added when one of
  the consumer apps adopts dark mode (Phase 6 candidate).
