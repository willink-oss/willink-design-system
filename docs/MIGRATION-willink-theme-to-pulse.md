# Migrating `willink_theme` → `pulse_theme` (PULSE)

`willink_theme` is discontinued. The Flutter design system is now
[PULSE](https://github.com/willink-oss/pulse_theme), published to pub.dev as
[`pulse_theme`](https://pub.dev/packages/pulse_theme). See
[ADR-0022](./adr/0022-pulse-supersedes-willink-theme.md) for why.

Most of this migration is a rename. The parts that are not are listed at the
bottom, and they are the only parts worth reading carefully.

## 1. Swap the dependency

```yaml
# pubspec.yaml
dependencies:
  pulse_theme: ^1.0.0     # was: willink_theme: ^1.5.0
```

```dart
import 'package:pulse_theme/pulse_theme.dart';   // was: package:willink_theme/willink_theme.dart
```

## 2. Rename the API

Every symbol keeps its shape; only the prefix changes. The theme factories are
the one exception — they were named after the brand, and are now named after
what they are.

| `willink_theme` | `pulse_theme` |
|---|---|
| `WillinkTheme.willink()` | `PulseTheme.light()` |
| `WillinkTheme.willinkDark()` | `PulseTheme.dark()` |
| `WillinkButton` | `PulseButton` |
| `WillinkButtonVariant` | `PulseButtonVariant` |
| `WillinkButtonSize` | `PulseButtonSize` |
| `WillinkEmptyState` | `PulseEmptyState` |
| `WillinkErrorState` | `PulseErrorState` |
| `WillinkLoadingState` | `PulseLoadingState` |
| `WillinkSectionCard` | `PulseSectionCard` |
| `WillinkTabBar` | `PulseTabBar` |
| `WillinkBottomSheet` | `PulseBottomSheet` |
| `WillinkSnackBar` | `PulseSnackBar` |
| `WillinkSnackBarVariant` | `PulseSnackBarVariant` |
| `WillinkProgressIndicator` | `PulseProgressIndicator` |
| `WillinkBrandTokens` | `PulseBrandTokens` |
| `WillinkPrimitives` | `PulsePrimitives` |
| `WillinkSemantics` | `PulseSemantics` |
| `WillinkSpacing` | `PulseSpacing` |

A find-and-replace of `Willink` → `Pulse` handles the table above, then fix the
two factory calls by hand.

## 3. What actually changed

### `PulseButton` gained a second axis

`WillinkButton` had `variant` (`filled` / `outline` / `ghost`) and `size`.
`PulseButton` keeps both and adds **`tone`** (`brand` / `danger`), so a
destructive action is a tone rather than a hand-coloured button:

```dart
PulseButton(
  variant: PulseButtonVariant.filled,
  tone: PulseButtonTone.danger,     // new — was a manual color override
  onPressed: _delete,
  child: const Text('Delete'),
)
```

`tone` defaults to `brand`, so existing call sites keep their behaviour.

It also has a non-dimming `isLoading` state that preserves the button's width —
use it instead of swapping the child for a spinner, which reflows the layout.

### Dark mode is a first-class factory, not a variant name

`WillinkTheme.willinkDark()` became `PulseTheme.dark()`. Behaviour is the same:
the semantic roles flip via the token contract's `willink.dark` extension.

### Re-branding takes a `ColorScheme`, not `copyWith` on the theme

This is the one migration that fails **silently** if you get it wrong.

```dart
// WRONG — component themes were already built on the default scheme, so this
// recolors almost nothing.
PulseTheme.light().copyWith(colorScheme: mine)

// RIGHT — hand the factory the scheme so it builds component themes from it.
PulseTheme.light(
  colorScheme: PulseTheme.lightColorScheme.copyWith(
    primary: const Color(0xFF0F766E),
  ),
)
```

### New: semantic radii

PULSE adds `PulseRadius` — corner radii named by *what kind of thing* is being
rounded (`control` 8px, `surface` 12px, `sheet` 16px, `pill`, `inset` 4px)
rather than by size. Prefer it over `PulsePrimitives.radius*` when building a
surface that should look like it belongs to PULSE.

### New: `PulseFontSize`, `PulseShadows`

The type scale and the elevation/glow shadows are now code-generated token
classes rather than values inlined in the theme.

### Tokens are generated, not mirrored

`willink_theme` hand-wrote its Dart token values, so a change to the token
contract needed a matching hand-edit. PULSE code-generates them from the
published `@willink-labs/tokens` DTCG JSON and fails CI on any drift. Nothing
changes for you as a consumer, except that a token change now actually arrives.

## 4. Staying on `willink_theme`

`willink_theme` 1.5.0 keeps working and keeps resolving. It will not receive
token updates or new components, and only a security issue would produce
another release. There is no deadline; there is also no reason to wait.
