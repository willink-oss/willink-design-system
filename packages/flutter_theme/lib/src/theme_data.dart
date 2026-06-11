// WillinkTheme — Material 3 ThemeData factory (single-brand baseline).
//
// Public API:
//   WillinkTheme.willink()      ← light baseline (the only factory 0.5.0–1.4.x).
//   WillinkTheme.willinkDark()  ← dark semantic flip (since 1.5.0, ADR-0013).
//
// Consumers that previously used WillinkTheme.clublink() / .fitai() should
// switch to WillinkTheme.willink() and override the resulting ColorScheme
// via ThemeData.copyWith(colorScheme: ColorScheme.fromSeed(...)).

import 'package:flutter/material.dart';
import 'theme_extensions/willink_brand_tokens.dart';
import 'tokens/primitive.dart';

/// Material 3 [ThemeData] factory for the i-Willink Design System.
class WillinkTheme {
  const WillinkTheme._();

  /// i-Willink default theme (vibrant violet).
  ///
  /// To customize the brand color, copyWith a new ColorScheme:
  /// ```dart
  /// final theme = WillinkTheme.willink().copyWith(
  ///   colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
  /// );
  /// ```
  static ThemeData willink() {
    final colorScheme = const ColorScheme(
      brightness: Brightness.light,
      primary: WillinkPrimitives.brand600,
      onPrimary: Color(0xFFFFFFFF),
      primaryContainer: WillinkPrimitives.brand100,
      onPrimaryContainer: WillinkPrimitives.brand900,
      secondary: WillinkPrimitives.brand500,
      onSecondary: Color(0xFFFFFFFF),
      secondaryContainer: WillinkPrimitives.brand100,
      onSecondaryContainer: WillinkPrimitives.brand900,
      tertiary: WillinkPrimitives.cyan500,
      onTertiary: Color(0xFFFFFFFF),
      error: WillinkPrimitives.red600,
      onError: Color(0xFFFFFFFF),
      surface: Color(0xFFFFFFFF),
      onSurface: WillinkPrimitives.neutral900,
      surfaceContainerHighest: WillinkPrimitives.neutral100,
      outline: WillinkPrimitives.neutral200,
      outlineVariant: WillinkPrimitives.neutral200,
    );
    return _base(colorScheme, WillinkBrandTokens.willink);
  }

  /// i-Willink dark theme — the semantic flip of [willink] per
  /// [ADR-0013](https://github.com/willink-oss/willink-design-system/blob/main/docs/adr/0013-dark-mode.md).
  ///
  /// Mirrors the `willink.dark` extensions in
  /// `@willink-labs/tokens/src/semantic.json`: surfaces flip to the dark
  /// neutral ladder (`bg` → neutral-950, `fg` → neutral-50, `muted` →
  /// neutral-400, `border` → neutral-800, `track` → neutral-700) while
  /// brand identity stays mode-invariant — `primary` is the same brand-600
  /// violet as the light theme, exactly as `text-brand-600` renders the
  /// same violet under a dark web root.
  ///
  /// ```dart
  /// MaterialApp(
  ///   theme: WillinkTheme.willink(),
  ///   darkTheme: WillinkTheme.willinkDark(),
  ///   themeMode: ThemeMode.system,
  /// )
  /// ```
  ///
  /// Brand customization works the same as the light factory — override the
  /// ColorScheme via `copyWith(colorScheme: ColorScheme.fromSeed(...,
  /// brightness: Brightness.dark))`.
  static ThemeData willinkDark() {
    final colorScheme = const ColorScheme(
      brightness: Brightness.dark,
      // brand / brand-fg are mode-invariant by design (ADR-0013).
      primary: WillinkPrimitives.brand600,
      onPrimary: Color(0xFFFFFFFF),
      // brand-soft / brand-soft-fg flip: brand-100/900 → brand-950/300.
      primaryContainer: WillinkPrimitives.brand950,
      onPrimaryContainer: WillinkPrimitives.brand300,
      secondary: WillinkPrimitives.brand500,
      onSecondary: Color(0xFFFFFFFF),
      secondaryContainer: WillinkPrimitives.brand950,
      onSecondaryContainer: WillinkPrimitives.brand300,
      // accent-cyan is mode-invariant by design (ADR-0013).
      tertiary: WillinkPrimitives.cyan500,
      onTertiary: Color(0xFFFFFFFF),
      // danger flip: red-600 → red-500.
      error: WillinkPrimitives.red500,
      onError: Color(0xFFFFFFFF),
      // bg / fg / muted flips.
      surface: WillinkPrimitives.neutral950,
      onSurface: WillinkPrimitives.neutral50,
      onSurfaceVariant: WillinkPrimitives.neutral400,
      // Surface-container ladder (dark, low → high == dark → light):
      //   surface-subtle → neutral-900, surface-muted → neutral-800,
      //   track → neutral-700 (consumed by WillinkProgressIndicator —
      //   the Material 3 equivalent of the React track's dark flip).
      surfaceContainerLow: WillinkPrimitives.neutral900,
      surfaceContainer: WillinkPrimitives.neutral900,
      surfaceContainerHigh: WillinkPrimitives.neutral800,
      surfaceContainerHighest: WillinkPrimitives.neutral700,
      // border flip: neutral-200 → neutral-800.
      outline: WillinkPrimitives.neutral800,
      outlineVariant: WillinkPrimitives.neutral800,
    );
    return _base(colorScheme, WillinkBrandTokens.willinkDark);
  }

  /// Shared [ThemeData] assembly — every component theme derives from the
  /// given [colorScheme], so light and dark stay structurally identical and
  /// the dark factory keeps every slot the light factory sets.
  static ThemeData _base(
    ColorScheme colorScheme,
    WillinkBrandTokens brandTokens,
  ) {
    return ThemeData(
      useMaterial3: true,
      brightness: colorScheme.brightness,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colorScheme.surface,
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.surface,
        foregroundColor: colorScheme.onSurface,
        elevation: 0,
        centerTitle: false,
        scrolledUnderElevation: 0,
      ),
      cardTheme: CardThemeData(
        color: colorScheme.surface,
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(WillinkPrimitives.radiusLg),
        ),
        clipBehavior: Clip.antiAlias,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          shape: const StadiumBorder(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
          elevation: 0,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          shape: const StadiumBorder(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
          elevation: 0,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: colorScheme.onSurface,
          side: BorderSide(color: colorScheme.outline),
          shape: const StadiumBorder(),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: colorScheme.primary,
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colorScheme.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(WillinkPrimitives.radiusMd),
          borderSide: BorderSide(color: colorScheme.outline),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(WillinkPrimitives.radiusMd),
          borderSide: BorderSide(color: colorScheme.outline),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(WillinkPrimitives.radiusMd),
          borderSide: BorderSide(color: colorScheme.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(WillinkPrimitives.radiusMd),
          borderSide: BorderSide(color: colorScheme.error),
        ),
      ),
      dividerTheme: DividerThemeData(
        color: colorScheme.outlineVariant,
        thickness: 1,
        space: 1,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: colorScheme.surfaceContainerHighest,
        labelStyle: TextStyle(color: colorScheme.onSurface),
        side: BorderSide(color: colorScheme.outline),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(WillinkPrimitives.radiusFull),
        ),
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(
        color: colorScheme.primary,
      ),
      extensions: <ThemeExtension<dynamic>>[brandTokens],
    );
  }
}
