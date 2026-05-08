// Semantic tokens —役割で命名・brand 軸ごとに上書きされる。
// Mirrors @willink-labs/tokens/src/semantic.json (default = i-Willink).

import 'package:flutter/painting.dart';
import 'primitive.dart';

/// Default semantic mapping (i-Willink brand). brand-specific overrides live
/// in [WillinkBrand.toColorScheme] in `brand_axis.dart`.
class WillinkSemantics {
  const WillinkSemantics._();

  /// Page background.
  static const Color bg = Color(0xFFFFFFFF);

  /// Body text color (= neutral-900).
  static const Color fg = WillinkPrimitives.neutral900;

  /// Muted / supplementary text (= neutral-500).
  static const Color muted = WillinkPrimitives.neutral500;

  /// Borders and dividers (= neutral-200).
  static const Color border = WillinkPrimitives.neutral200;

  /// Focus ring color (= brand).
  static const Color ring = WillinkPrimitives.brand600;

  /// Primary action / brand identity (= brand-600).
  static const Color brand = WillinkPrimitives.brand600;

  /// Foreground on top of brand surfaces.
  static const Color brandFg = Color(0xFFFFFFFF);

  /// Primary button glow shadow base (= brand-500).
  static const Color brandGlow = WillinkPrimitives.brand500;

  /// AI-tech accent (cyan).
  static const Color accentCyan = WillinkPrimitives.cyan500;

  /// AI-tech accent (pink — gradient terminus).
  static const Color accentPink = WillinkPrimitives.pink500;

  /// Success state (= green-600).
  static const Color success = WillinkPrimitives.green600;

  /// Warning state (= amber-600).
  static const Color warning = WillinkPrimitives.amber600;

  /// Danger state (= red-600).
  static const Color danger = WillinkPrimitives.red600;
}
