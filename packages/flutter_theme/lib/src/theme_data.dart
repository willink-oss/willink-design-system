// WillinkTheme — Material 3 ThemeData factory (single-brand baseline).
//
// Public API:
//   WillinkTheme.willink()  ← the only factory (since 0.5.0).
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
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
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
      extensions: <ThemeExtension<dynamic>>[WillinkBrandTokens.willink],
    );
  }
}
