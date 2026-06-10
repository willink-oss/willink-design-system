# Changelog

All notable changes to `willink_theme` will be documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.1.0` for exact-minor stability).

## [1.3.0] — 2026-06-11

### Added — WillinkSnackBar component ([#13](https://github.com/willink-oss/willink-design-system/issues/13), v1.1 parity PR 3/4)

Material 3 brand-aware snack bar helper — parity with the React DS `Toast`
(brand-styled sonner wrapper). Thin wrapper over
`ScaffoldMessenger.showSnackBar`:

- `WillinkSnackBar.show(context, message: ...)` — returns the
  `ScaffoldFeatureController` from `showSnackBar`
- variants: `info` (default) / `success` / `error` via `WillinkSnackBarVariant`
- neutral surface styling mirroring the React toast: `colorScheme.surface`
  background, `outline` border, 12px radius (`radiusLg`), floating behavior
- semantics carried by the leading icon accent — `colorScheme.primary` (info) /
  `WillinkSemantics.success` (success) / `colorScheme.error` (error) — so the
  snack bar follows any brand the consumer configures via
  `copyWith(colorScheme: ...)`
- optional `description` line (muted, `onSurfaceVariant`)
- optional `actionLabel` + `onAction` → `SnackBarAction` in `colorScheme.primary`
- reuses Material 3 SnackBar timing and queueing (default 4s, overridable
  `duration`); no custom queue logic

Flutter-only minor per [ADR-0011](../../docs/adr/0011-flutter-independent-versioning.md)
— the npm packages are unchanged and stay at their own versions.

### Migration from 1.2.x
No breaking changes. Additive release — `WillinkSnackBar` is opt-in.

### Verification
- flutter analyze: 0 issues
- flutter test: all pass (7 new snack bar tests)
- dart pub publish --dry-run: clean

## [1.2.0] — 2026-06-11

### Added — WillinkBottomSheet component (1 component)

Material 3 brand-aware modal bottom sheet mirroring the React DS `Sheet`
(`<SheetContent side="bottom">` — mobile action sheet), as a thin wrapper
over Material 3 `showModalBottomSheet`:
- `WillinkBottomSheet.show<T>(context, builder: ...)` static helper returning `Future<T?>` (resolves with the `Navigator.pop` value, or `null` on barrier tap / drag-down dismiss)
- `isScrollControlled` / `isDismissible` / `enableDrag` / `useSafeArea` pass-through (same contract and defaults as `showModalBottomSheet`)
- `showDragHandle` flag (default `true`) — renders a 32×4 rounded drag handle tinted with `colorScheme.outlineVariant` (manual, since `showModalBottomSheet` exposes no per-call handle color)
- `WillinkBottomSheet` widget — minimal title + child content scaffold (title 18px / w600, mirrors React `SheetTitle`)
- barrier is black at 50% alpha, matching the React Sheet overlay (`bg-black/50`)
- top corners use `WillinkPrimitives.radiusXl` (16px — the DS radius feel, instead of the Material 3 default 28px)

Colors derive from `Theme.of(context).colorScheme` (sheet surface =
`surface`, drag handle = `outlineVariant`, title = `onSurface`) so the
sheet follows any brand the consumer configures via
`copyWith(colorScheme: ...)` automatically.

Second of the four v1.1 Flutter parity components carried over from v1.0
Phase 9.4 ([#13](https://github.com/willink-oss/willink-design-system/issues/13));
ships as an independent minor per
[ADR-0011](../../docs/adr/0011-flutter-independent-versioning.md).

### Migration from 1.1.0
No breaking changes. Additive release — `WillinkBottomSheet` は opt-in。既存
components の API は完全互換。

### Verification
- flutter analyze: 0 issues
- flutter test: all pass (new 7 bottom sheet tests included; 37 on this branch — existing 30 + 7)
- dart pub publish --dry-run: clean

## [1.1.0] — 2026-06-11

### Added — WillinkTabBar component (1 component)

Material 3 brand-aware tab bar mirroring the React DS `Tabs` compound
(`<Tabs><TabsList><TabsTrigger/>...`), as a thin wrapper over Material 3
`TabBar`:
- `tabs` pass-through (`List<Widget>`, typically `Tab` instances)
- `controller` / ancestor `DefaultTabController` selection state (same contract as `TabBar`)
- `onTap` callback with the tapped index
- `isScrollable` flag
- implements `PreferredSizeWidget` so it slots into `AppBar.bottom`

Colors derive from `Theme.of(context).colorScheme` (indicator + selected
label = `primary`, unselected label = `onSurfaceVariant`, divider =
`outlineVariant`) so the tab bar follows any brand the consumer configures
via `copyWith(colorScheme: ...)` automatically.

First of the four v1.1 Flutter parity components carried over from v1.0
Phase 9.4 ([#13](https://github.com/willink-oss/willink-design-system/issues/13));
ships as an independent minor per
[ADR-0011](../../docs/adr/0011-flutter-independent-versioning.md).

### Migration from 1.0.0
No breaking changes. Additive release — `WillinkTabBar` は opt-in。既存 5
components の API は完全互換。

### Verification
- flutter analyze: 0 issues
- flutter test: 37 tests pass (existing 30 + new 7 tab bar tests)
- dart pub publish --dry-run: clean

## [1.0.0] — 2026-05-17

### API freeze (coincidence cut with the npm group)

First stable release. The `WillinkTheme` factory, `WillinkSpacing` scale, the 5 component widgets (`WillinkButton`, `WillinkEmptyState`, `WillinkErrorState`, `WillinkLoadingState`, `WillinkSectionCard`), and the `tokens_sync_test.dart` token-drift guard are now part of the SemVer-2.0 contract.

No content change vs. `flutter-v0.5.0`. The bump is a one-time storytelling coincidence with the npm group's `1.0.0` cut — from `flutter-v1.0.1` onward `willink_theme` floats per [ADR-0011](../../docs/adr/0011-flutter-independent-versioning.md). Future Flutter minors and patches track Flutter-side cadence; they do not have to wait for an npm release, and vice versa.

### Out of v1.0 scope (deferred to v1.1+)

- Phase 7 component expansion (`WillinkTabBar`, `WillinkBottomSheet`, `WillinkSnackBar`, `WillinkProgressIndicator`) — deferred so the first-stable cut is not blocked. Each is planned as its own minor.
- Dark mode variant — light-only ships first to keep the API surface fixed.

## [0.5.0] — 2026-05-16

### Breaking — brand axis machinery removed

`WillinkBrand` enum and per-brand factories (`WillinkTheme.clublink()` / `.fitai()` / `WillinkTheme.fromBrand()`) have been removed. `WillinkTheme.willink()` is now the single factory.

**Removed**:
- `lib/src/brand_axis.dart` (entire file — `WillinkBrand` enum + `toColorScheme()`)
- `WillinkTheme.fromBrand(WillinkBrand)` factory
- `WillinkTheme.clublink()` factory
- `WillinkTheme.fitai()` factory
- `WillinkBrandTokens.clublink` static getter
- `WillinkBrandTokens.fitai` static getter
- `WillinkPrimitives.fitaiPrimary` / `fitaiSecondary` / `fitaiTertiary` constants
- `test/brand_axis_test.dart` (entire file)
- `export 'src/brand_axis.dart'` from package entrypoint

**Kept**:
- `WillinkTheme.willink()` — the single Material 3 ThemeData factory
- `WillinkBrandTokens.willink` — non-Material brand tokens (glow / gradient / shadow)
- All `WillinkPrimitives.*` color and motion constants (neutral / brand / blue / green / cyan / pink / sky / red / amber)
- All component widgets (`WillinkEmptyState` / `WillinkErrorState` / `WillinkLoadingState` / `WillinkSectionCard` / `WillinkButton`)

### Migration

```diff
- final theme = WillinkTheme.clublink();
+ final theme = WillinkTheme.willink().copyWith(
+   colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
+ );

- final theme = WillinkTheme.fitai();
+ final theme = WillinkTheme.willink().copyWith(
+   colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF3B82F6)),
+ );
```

For consumers that previously used `WillinkBrandTokens.clublink` / `.fitai`:

```dart
// 0.4.x:
final tokens = WillinkBrandTokens.clublink;

// 0.5.0+: construct your own custom WillinkBrandTokens:
final tokens = WillinkBrandTokens(
  brandGlow: const Color(0xFF3B82F6),
  brandGradient: const LinearGradient(
    begin: Alignment.topLeft, end: Alignment.bottomRight,
    colors: [Color(0xFF2563EB), Color(0xFF10B981)],
  ),
  subtleGradient: WillinkBrandTokens.willink.subtleGradient,
  aiGradient: WillinkBrandTokens.willink.aiGradient,
  shadowSoft: WillinkBrandTokens.willink.shadowSoft,
  shadowGlow: const [
    BoxShadow(color: Color(0x4C2563EB), offset: Offset(0, 0), blurRadius: 20, spreadRadius: -5),
  ],
);
```

### Why
Matches the React side of the DS (which dropped the `[data-brand="..."]` mechanism in `@willink-labs/tailwind-preset@0.8.0`). ClubLink / fit-ai are independent products and now configure their own ColorScheme rather than relying on a per-product factory in DS.

### Verification
- `flutter analyze`: 0 issues
- `flutter test`: all pass (brand_axis_test.dart removed; theme_data_test.dart updated to single-brand assertions)
- `dart pub publish --dry-run`: clean

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
