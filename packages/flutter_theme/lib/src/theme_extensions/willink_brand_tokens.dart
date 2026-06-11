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
    required this.subtleGradient,
    required this.aiGradient,
    required this.shadowSoft,
    required this.shadowGlow,
  });

  /// Brand glow color (used as a shadow color base for primary buttons).
  /// Mirrors the React DS `--shadow-glow` semantic token.
  final Color brandGlow;

  /// Hero / primary surface gradient. Mirrors `bg-gradient-primary` from the
  /// React DS preset (brand → blue diagonal).
  final LinearGradient brandGradient;

  /// Subtle background gradient (white → brand-50 → sky-50). Mirrors
  /// `bg-gradient-subtle`. Useful for hero sections and large surfaces that
  /// shouldn't overwhelm the foreground.
  final LinearGradient subtleGradient;

  /// AI-tech accent gradient (cyan → brand-500 → pink). Mirrors `bg-gradient-ai`.
  /// Reserved for "AI"-flavored UI moments — not for general use.
  final LinearGradient aiGradient;

  /// Soft default shadow (mirrors `--shadow-soft`).
  final List<BoxShadow> shadowSoft;

  /// Brand-tinted glow shadow (mirrors `--shadow-glow`).
  final List<BoxShadow> shadowGlow;

  @override
  WillinkBrandTokens copyWith({
    Color? brandGlow,
    LinearGradient? brandGradient,
    LinearGradient? subtleGradient,
    LinearGradient? aiGradient,
    List<BoxShadow>? shadowSoft,
    List<BoxShadow>? shadowGlow,
  }) {
    return WillinkBrandTokens(
      brandGlow: brandGlow ?? this.brandGlow,
      brandGradient: brandGradient ?? this.brandGradient,
      subtleGradient: subtleGradient ?? this.subtleGradient,
      aiGradient: aiGradient ?? this.aiGradient,
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
      brandGradient:
          LinearGradient.lerp(brandGradient, other.brandGradient, t)!,
      subtleGradient:
          LinearGradient.lerp(subtleGradient, other.subtleGradient, t)!,
      aiGradient: LinearGradient.lerp(aiGradient, other.aiGradient, t)!,
      shadowSoft: t < 0.5 ? shadowSoft : other.shadowSoft,
      shadowGlow: t < 0.5 ? shadowGlow : other.shadowGlow,
    );
  }

  // === Default presets per brand ===
  // The subtle and AI gradients reuse the same primitive triplet across brands
  // (white → brand-50 → sky-50 / cyan → brand-500 → pink). Brand identity is
  // expressed through `brandGlow` and `brandGradient`.
  //
  // Mode-invariant pieces (ADR-0013): `brandGradient`, `aiGradient`, and
  // `shadowGlow` are shared between [willink] and [willinkDark] — brand
  // identity does not flip. Only the white-anchored `subtleGradient` and the
  // black-alpha `shadowSoft` carry dark variants.

  static const LinearGradient _subtleGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFFFFFFFF),
      WillinkPrimitives.brand50,
      WillinkPrimitives.sky50,
    ],
    stops: [0.0, 0.5, 1.0],
  );

  /// Dark counterpart of [_subtleGradient] — mirrors the preset's dark
  /// `bg-gradient-subtle` derivation (`bg` → `brand-soft` →
  /// `gradient-subtle-end`): neutral-950 → brand-950 → neutral-900. The
  /// white / sky-50 anchors would pin a light tint under a dark root.
  static const LinearGradient _subtleGradientDark = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      WillinkPrimitives.neutral950,
      WillinkPrimitives.brand950,
      WillinkPrimitives.neutral900,
    ],
    stops: [0.0, 0.5, 1.0],
  );

  static const LinearGradient _aiGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      WillinkPrimitives.cyan500,
      WillinkPrimitives.brand500,
      WillinkPrimitives.pink500,
    ],
    stops: [0.0, 0.5, 1.0],
  );

  static const List<BoxShadow> _shadowSoftDefault = [
    BoxShadow(
      color: Color(0x0D000000), // rgba(0, 0, 0, 0.05)
      offset: Offset(0, 4),
      blurRadius: 20,
      spreadRadius: -2,
    ),
  ];

  /// Dark counterpart of [_shadowSoftDefault] — same geometry, black alpha
  /// raised 0.05 → 0.4 so the shadow stays legible against neutral-950
  /// (mirrors the preset's dark `--shadow-soft` override).
  static const List<BoxShadow> _shadowSoftDark = [
    BoxShadow(
      color: Color(0x66000000), // rgba(0, 0, 0, 0.4)
      offset: Offset(0, 4),
      blurRadius: 20,
      spreadRadius: -2,
    ),
  ];

  /// Hero gradient for the i-Willink brand (brand-600 → blue-600 diagonal).
  /// Mode-invariant — shared by [willink] and [willinkDark].
  static const LinearGradient _willinkBrandGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [WillinkPrimitives.brand600, WillinkPrimitives.blue600],
    stops: [0.0, 1.0],
  );

  /// Brand-tinted glow shadow (`--shadow-glow`). Mode-invariant — the glow
  /// is brand-colored, not black-anchored, so it reads on both surfaces.
  static const List<BoxShadow> _willinkShadowGlow = [
    BoxShadow(
      color: Color(0x4C7C3AED), // rgba(124, 58, 237, 0.3)
      offset: Offset(0, 0),
      blurRadius: 20,
      spreadRadius: -5,
    ),
  ];

  /// Default tokens for the i-Willink brand.
  static WillinkBrandTokens get willink => const WillinkBrandTokens(
    brandGlow: WillinkPrimitives.brand500,
    brandGradient: _willinkBrandGradient,
    subtleGradient: _subtleGradient,
    aiGradient: _aiGradient,
    shadowSoft: _shadowSoftDefault,
    shadowGlow: _willinkShadowGlow,
  );

  /// Dark-mode tokens for the i-Willink brand (ADR-0013, since 1.5.0).
  ///
  /// Brand identity is mode-invariant: [brandGlow], [brandGradient],
  /// [aiGradient], and [shadowGlow] are identical to [willink]. Only the
  /// white-anchored pieces flip — [subtleGradient] moves to the dark surface
  /// ladder (neutral-950 → brand-950 → neutral-900) and [shadowSoft] raises
  /// its black alpha, mirroring the preset's dark `--shadow-soft`.
  static WillinkBrandTokens get willinkDark => const WillinkBrandTokens(
    brandGlow: WillinkPrimitives.brand500,
    brandGradient: _willinkBrandGradient,
    subtleGradient: _subtleGradientDark,
    aiGradient: _aiGradient,
    shadowSoft: _shadowSoftDark,
    shadowGlow: _willinkShadowGlow,
  );
}
