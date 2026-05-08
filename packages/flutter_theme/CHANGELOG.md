# Changelog

All notable changes to `willink_theme` will be documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.1.0` for exact-minor stability).

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
- `brand_axis_test.dart` documenting the 3-brand scope (and (internal project)'s
  intentional exclusion).

### Status notes
- pub.dev publish requires CEO action (org account `willink_labs` setup +
  Trusted Publisher configuration). The included
  `.github/workflows/publish-flutter.yml` is workflow_dispatch-ready once
  that's in place.
- `(internal project)` ((internal partner) delivered) is intentionally **out of scope** for Phase 5.
  Phase 5 covers only i-Willink-released apps (fit-ai, clubhouse). If (internal-partner)
  later adopts willink_theme independently, that's a separate downstream
  decision and would not require changes to this package.
- Light mode only at this stage; dark variants will be added when one of
  the consumer apps adopts dark mode (Phase 6 candidate).
