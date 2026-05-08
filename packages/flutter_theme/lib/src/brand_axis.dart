// Brand axis enum + per-brand ColorScheme derivation.
//
// Mirrors the React DS `[data-brand="willink|clublink"]` pattern. (internal project) ((internal partner)
// delivered) is intentionally absent — see CHANGELOG and PR description for the
// scope decision (5/8 21:23 JST CEO confirmation).

import 'package:flutter/material.dart';
import 'tokens/primitive.dart';

/// Available brand axes for [WillinkTheme].
enum WillinkBrand {
  /// i-Willink default — vibrant violet (#7C3AED).
  willink,

  /// ClubLink — blue (#2563EB). Shared by clublink-platform (Web) and
  /// clubhouse (Flutter) since they target the same brand.
  clublink,

  /// fit-ai — blue + emerald (existing fit-ai palette preserved).
  fitai;

  /// Build the Material 3 [ColorScheme] for this brand axis.
  ///
  /// Light mode only at this stage; dark counterparts will be added when one
  /// of the consumer apps adopts dark mode.
  ColorScheme toColorScheme() {
    switch (this) {
      case WillinkBrand.willink:
        return const ColorScheme(
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
          surfaceContainerHighest: WillinkPrimitives.neutral50,
          onSurfaceVariant: WillinkPrimitives.neutral500,
          outline: WillinkPrimitives.neutral200,
          outlineVariant: WillinkPrimitives.neutral100,
        );
      case WillinkBrand.clublink:
        return const ColorScheme(
          brightness: Brightness.light,
          primary: WillinkPrimitives.blue600,
          onPrimary: Color(0xFFFFFFFF),
          primaryContainer: WillinkPrimitives.blue100,
          onPrimaryContainer: WillinkPrimitives.blue900,
          secondary: WillinkPrimitives.blue500,
          onSecondary: Color(0xFFFFFFFF),
          secondaryContainer: WillinkPrimitives.blue100,
          onSecondaryContainer: WillinkPrimitives.blue900,
          tertiary: WillinkPrimitives.green500,
          onTertiary: Color(0xFFFFFFFF),
          error: WillinkPrimitives.red600,
          onError: Color(0xFFFFFFFF),
          surface: Color(0xFFFFFFFF),
          onSurface: WillinkPrimitives.neutral900,
          surfaceContainerHighest: WillinkPrimitives.neutral50,
          onSurfaceVariant: WillinkPrimitives.neutral500,
          outline: WillinkPrimitives.neutral200,
          outlineVariant: WillinkPrimitives.neutral100,
        );
      case WillinkBrand.fitai:
        return const ColorScheme(
          brightness: Brightness.light,
          primary: WillinkPrimitives.fitaiPrimary,
          onPrimary: Color(0xFFFFFFFF),
          primaryContainer: WillinkPrimitives.blue100,
          onPrimaryContainer: WillinkPrimitives.blue900,
          secondary: WillinkPrimitives.fitaiSecondary,
          onSecondary: Color(0xFF064E3B),
          secondaryContainer: Color(0xFFD1FAE5),
          onSecondaryContainer: Color(0xFF064E3B),
          tertiary: WillinkPrimitives.fitaiTertiary,
          onTertiary: Color(0xFFFFFFFF),
          error: WillinkPrimitives.red600,
          onError: Color(0xFFFFFFFF),
          surface: Color(0xFFFFFFFF),
          onSurface: WillinkPrimitives.neutral900,
          surfaceContainerHighest: WillinkPrimitives.neutral50,
          onSurfaceVariant: WillinkPrimitives.neutral500,
          outline: WillinkPrimitives.neutral200,
          outlineVariant: WillinkPrimitives.neutral100,
        );
    }
  }
}
