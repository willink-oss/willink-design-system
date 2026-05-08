// ThemeExtension that exposes non-Material brand tokens (glow / gradient /
// custom shadows). Material 3's ColorScheme alone cannot represent these.

import 'package:flutter/material.dart';
import '../tokens/primitive.dart';

/// Non-Material brand tokens carried alongside [ThemeData].
///
/// Access from a widget via:
/// ```dart
/// final brandTokens = Theme.of(context).extension<WillinkBrandTokens>()!;
/// ```
@immutable
class WillinkBrandTokens extends ThemeExtension<WillinkBrandTokens> {
  const WillinkBrandTokens({
    required this.brandGlow,
    required this.brandGradient,
    required this.shadowSoft,
    required this.shadowGlow,
  });

  /// Brand glow color (used as a shadow color base for primary buttons).
  /// Mirrors the React DS `--shadow-glow` semantic token.
  final Color brandGlow;

  /// Hero / primary surface gradient. Mirrors `bg-gradient-primary`.
  final LinearGradient brandGradient;

  /// Soft default shadow (mirrors `--shadow-soft`).
  final List<BoxShadow> shadowSoft;

  /// Brand-tinted glow shadow (mirrors `--shadow-glow`).
  final List<BoxShadow> shadowGlow;

  @override
  WillinkBrandTokens copyWith({
    Color? brandGlow,
    LinearGradient? brandGradient,
    List<BoxShadow>? shadowSoft,
    List<BoxShadow>? shadowGlow,
  }) {
    return WillinkBrandTokens(
      brandGlow: brandGlow ?? this.brandGlow,
      brandGradient: brandGradient ?? this.brandGradient,
      shadowSoft: shadowSoft ?? this.shadowSoft,
      shadowGlow: shadowGlow ?? this.shadowGlow,
    );
  }

  @override
  WillinkBrandTokens lerp(
    covariant ThemeExtension<WillinkBrandTokens>? other,
    double t,
  ) {
    if (other is! WillinkBrandTokens) return this;
    return WillinkBrandTokens(
      brandGlow: Color.lerp(brandGlow, other.brandGlow, t)!,
      brandGradient: LinearGradient.lerp(brandGradient, other.brandGradient, t)!,
      shadowSoft: t < 0.5 ? shadowSoft : other.shadowSoft,
      shadowGlow: t < 0.5 ? shadowGlow : other.shadowGlow,
    );
  }

  /// Default tokens for the i-Willink brand.
  static WillinkBrandTokens get willink => const WillinkBrandTokens(
    brandGlow: WillinkPrimitives.brand500,
    brandGradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [WillinkPrimitives.brand600, WillinkPrimitives.blue600],
      stops: [0.0, 1.0],
    ),
    shadowSoft: [
      BoxShadow(
        color: Color(0x0D000000), // rgba(0, 0, 0, 0.05)
        offset: Offset(0, 4),
        blurRadius: 20,
        spreadRadius: -2,
      ),
    ],
    shadowGlow: [
      BoxShadow(
        color: Color(0x4C7C3AED), // rgba(124, 58, 237, 0.3)
        offset: Offset(0, 0),
        blurRadius: 20,
        spreadRadius: -5,
      ),
    ],
  );

  /// Tokens for the ClubLink brand (blue glow).
  static WillinkBrandTokens get clublink => const WillinkBrandTokens(
    brandGlow: WillinkPrimitives.blue500,
    brandGradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [WillinkPrimitives.blue600, WillinkPrimitives.green500],
      stops: [0.0, 1.0],
    ),
    shadowSoft: [
      BoxShadow(
        color: Color(0x0D000000),
        offset: Offset(0, 4),
        blurRadius: 20,
        spreadRadius: -2,
      ),
    ],
    shadowGlow: [
      BoxShadow(
        color: Color(0x4C2563EB), // rgba(37, 99, 235, 0.3)
        offset: Offset(0, 0),
        blurRadius: 20,
        spreadRadius: -5,
      ),
    ],
  );

  /// Tokens for the fit-ai brand (blue glow + emerald accents).
  static WillinkBrandTokens get fitai => const WillinkBrandTokens(
    brandGlow: WillinkPrimitives.fitaiPrimary,
    brandGradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [WillinkPrimitives.fitaiPrimary, WillinkPrimitives.fitaiSecondary],
      stops: [0.0, 1.0],
    ),
    shadowSoft: [
      BoxShadow(
        color: Color(0x0D000000),
        offset: Offset(0, 4),
        blurRadius: 20,
        spreadRadius: -2,
      ),
    ],
    shadowGlow: [
      BoxShadow(
        color: Color(0x4C3B82F6), // rgba(59, 130, 246, 0.3)
        offset: Offset(0, 0),
        blurRadius: 20,
        spreadRadius: -5,
      ),
    ],
  );
}
