# willink_theme

Material 3 theme for i-Willink Design System Flutter apps — `ThemeData` factory,
spacing / token constants, and **9 brand-aware components** on a single-brand
baseline. The Flutter counterpart of
[`@willink-labs/react`](https://www.npmjs.com/package/@willink-labs/react) /
[`@willink-labs/tailwind-preset`](https://www.npmjs.com/package/@willink-labs/tailwind-preset).

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
      theme: WillinkTheme.willink(), // the single factory (since 0.5.0)
      home: const HomeScreen(),
    );
  }
}
```

## Customizing the brand color

The DS ships the i-Willink violet (`#7C3AED`) baseline. Consumers re-brand via
standard Material 3 `copyWith` — every component reads colors from
`Theme.of(context).colorScheme`, so overrides flow through automatically (the
Flutter equivalent of the CSS `--color-brand` `:root` override on the npm side):

```dart
final theme = WillinkTheme.willink().copyWith(
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
);
```

## Components (9)

| Component | Mirrors (React DS) | Shape |
|---|---|---|
| `WillinkButton` | `Button` | variants (`WillinkButtonVariant`) × sizes (`WillinkButtonSize`) |
| `WillinkEmptyState` | — | icon + message + optional CTA |
| `WillinkErrorState` | — | error message + retry |
| `WillinkLoadingState` | — | full-area loading state (centered spinner + caption) |
| `WillinkSectionCard` | `Card` | section container |
| `WillinkTabBar` | `Tabs` | `PreferredSizeWidget`, slots into `AppBar.bottom` |
| `WillinkBottomSheet` | `Sheet` (`side="bottom"`) | `WillinkBottomSheet.show<T>()` + title/child scaffold |
| `WillinkSnackBar` | `Toast` | `WillinkSnackBar.show()` with `info / success / error` variants |
| `WillinkProgressIndicator` | `Progress` | determinate (`value` 0.0–1.0) / indeterminate (`null`) |

```dart
// TabBar — inside an AppBar
appBar: AppBar(
  bottom: const WillinkTabBar(
    tabs: [Tab(text: 'アカウント'), Tab(text: 'パスワード')],
  ),
),

// BottomSheet
final applied = await WillinkBottomSheet.show<bool>(
  context,
  builder: (context) => WillinkBottomSheet(
    title: 'フィルター',
    child: const FilterForm(),
  ),
);

// SnackBar
WillinkSnackBar.show(
  context,
  message: '保存しました',
  variant: WillinkSnackBarVariant.success,
);

// Progress
WillinkProgressIndicator(value: 0.65)
```

## Spacing

Material 3 4-multiple scale. Use these everywhere you'd otherwise hard-code
a `double` for padding / gap / margin:

```dart
Padding(padding: EdgeInsets.all(WillinkSpacing.md), child: ...)
SizedBox(height: WillinkSpacing.lg)
```

| Token | dp | Typical use |
|---|---|---|
| `WillinkSpacing.xs` | 4 | icon ↔ label gap, dense rows |
| `WillinkSpacing.sm` | 8 | chip gaps, compact layouts |
| `WillinkSpacing.md` | 16 | default content padding |
| `WillinkSpacing.lg` | 24 | section separator |
| `WillinkSpacing.xl` | 32 | between page-level sections |
| `WillinkSpacing.xxl` | 48 | hero blocks, top-of-page padding |

## Brand tokens beyond Material

Tokens that don't fit Material's palette (glow color, gradient presets, soft
shadows) ride a `ThemeExtension`:

```dart
final tokens = Theme.of(context).extension<WillinkBrandTokens>()!;
Container(decoration: BoxDecoration(gradient: tokens.brandGradient));  // hero
Container(decoration: BoxDecoration(gradient: tokens.subtleGradient)); // bg
Container(decoration: BoxDecoration(gradient: tokens.aiGradient));     // AI moments
```

## Token sync

`WillinkPrimitives.*` constants must match
`@willink-labs/tokens/src/primitive.json`. Verified by
`test/tokens_sync_test.dart` — CI fails if a hex value drifts.

This is the same "single source of truth" guarantee that `vitest`'s
`check-tokens.test.ts` enforces on the React side. Both languages share one
canonical DTCG JSON.

## Versioning

Strict [SemVer 2.0](https://semver.org/) since `1.0.0`. `willink_theme`
versions **independently** of the `@willink-labs/*` npm packages — see
[ADR-0011](https://github.com/willink-oss/willink-design-system/blob/main/docs/adr/0011-flutter-independent-versioning.md).
Pin `^1.0.0` and trust MINOR / PATCH per
[ADR-0010](https://github.com/willink-oss/willink-design-system/blob/main/docs/adr/0010-semver-policy.md).

## License

MIT License — see [LICENSE](../../LICENSE) for details.
