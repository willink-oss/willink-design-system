// WillinkTheme — Material 3 ThemeData factories.
//
// Public API:
//   WillinkTheme.fromBrand(WillinkBrand)  ← base factory
//   WillinkTheme.willink()                ← alias
//   WillinkTheme.clublink()               ← alias
//   WillinkTheme.fitai()                  ← alias

import 'package:flutter/material.dart';
import 'brand_axis.dart';
import 'theme_extensions/willink_brand_tokens.dart';
import 'tokens/primitive.dart';

/// Material 3 [ThemeData] factories for the i-Willink Design System.
class WillinkTheme {
  const WillinkTheme._();

  /// Build a [ThemeData] for the given [brand].
  ///
  /// Consumers usually call one of the named aliases ([willink], [clublink],
  /// [fitai]). Use [fromBrand] when the brand value is dynamic — for example
  /// when it comes from a settings provider in the playground app.
  static ThemeData fromBrand(WillinkBrand brand) {
    final colorScheme = brand.toColorScheme();
    final brandTokens = _brandTokensFor(brand);
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
      extensions: <ThemeExtension<dynamic>>[brandTokens],
    );
  }

  /// i-Willink default theme (vibrant violet).
  static ThemeData willink() => fromBrand(WillinkBrand.willink);

  /// ClubLink theme (blue · shared by clublink-platform Web and clubhouse).
  static ThemeData clublink() => fromBrand(WillinkBrand.clublink);

  /// fit-ai theme (existing blue + emerald palette preserved).
  static ThemeData fitai() => fromBrand(WillinkBrand.fitai);

  static WillinkBrandTokens _brandTokensFor(WillinkBrand brand) {
    switch (brand) {
      case WillinkBrand.willink:
        return WillinkBrandTokens.willink;
      case WillinkBrand.clublink:
        return WillinkBrandTokens.clublink;
      case WillinkBrand.fitai:
        return WillinkBrandTokens.fitai;
    }
  }
}
