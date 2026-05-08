# `@willink-labs/flutter_theme` (pub.dev: `willink_theme`)

Material 3 theme for i-Willink Design System Flutter apps. Mirrors the React DS
`[data-brand="willink|clublink"]` pattern from `@willink-labs/tailwind-preset`.

## Quick start

```dart
import 'package:flutter/material.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      theme: WillinkTheme.clublink(), // or .willink() / .fitai()
      home: const HomeScreen(),
    );
  }
}
```

## Brand axes

| Brand | Primary | Use case |
|---|---|---|
| `WillinkBrand.willink` | violet `#7C3AED` | i-Willink default · marketing apps |
| `WillinkBrand.clublink` | blue `#2563EB` | ClubLink (web) / clubhouse (Flutter, same brand) |
| `WillinkBrand.fitai` | blue `#3B82F6` + emerald | fit-ai (existing palette preserved) |

`(internal project)` (delivered to (internal partner)) is intentionally **out of scope**. If (internal-partner) adopts
this package independently, that is their choice — they would either reuse one
of the brands above or propose a new axis through the maintainers.

## Why a Theme package and not just constants?

- A consumer that wires `WillinkTheme.fromBrand(brand)` into `MaterialApp.theme`
  gets the complete Material 3 stack (ColorScheme, FilledButton shape,
  InputDecoration radius, Card shape, Divider, etc.) in one line. No manual
  re-implementation per app.
- Brand-specific tokens that don't fit Material's palette (glow color,
  hero gradient, soft shadows) are carried as a `WillinkBrandTokens`
  `ThemeExtension`, accessible from any widget via
  `Theme.of(context).extension<WillinkBrandTokens>()!`.

## Token sync

`WillinkPrimitives.*` constants must match
`@willink-labs/tokens/src/primitive.json`. Verified by
`test/tokens_sync_test.dart` — CI fails if a hex value drifts.

This is the same "single source of truth" guarantee that `vitest`'s
`check-tokens.test.ts` enforces on the React side. Both languages share one
canonical DTCG JSON.

## Maintenance — adding a new brand

1. Add to `lib/src/tokens/primitive.dart` if any new primitive shades are needed.
2. Extend `WillinkBrand` enum in `lib/src/brand_axis.dart` (handle the new
   case in `toColorScheme()`).
3. Add a static getter on `WillinkBrandTokens` for the brand's
   non-Material extras.
4. Add `WillinkTheme.<newBrand>()` alias in `lib/src/theme_data.dart`.
5. Update `test/brand_axis_test.dart` enum count.
6. Bump version in `pubspec.yaml` (minor for additive, major for breaking).

## Versioning

`0.x.x` — pre-1.0, minor bumps may include breaking changes. Pin with `~0.1.0`
for exact-minor stability. Released as part of the same lockstep cadence as
`@willink-labs/{tokens,tailwind-preset,react}`.
