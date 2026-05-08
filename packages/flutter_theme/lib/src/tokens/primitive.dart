// Primitive color tokens — mirrors @willink-labs/tokens/src/primitive.json.
//
// Single source of truth: DO NOT edit these constants without updating
// primitive.json. Verified by test/tokens_sync_test.dart.

import 'package:flutter/animation.dart';

/// Primitive (raw) color and motion tokens. Consumers should normally use
/// [WillinkSemantics] or the brand-specific [ThemeData] factories instead.
class WillinkPrimitives {
  const WillinkPrimitives._();

  // === Neutral 50–950 ===
  static const Color neutral50 = Color(0xFFF8FAFC);
  static const Color neutral100 = Color(0xFFF1F5F9);
  static const Color neutral200 = Color(0xFFE2E8F0);
  static const Color neutral300 = Color(0xFFCBD5E1);
  static const Color neutral400 = Color(0xFF94A3B8);
  static const Color neutral500 = Color(0xFF64748B);
  static const Color neutral600 = Color(0xFF475569);
  static const Color neutral700 = Color(0xFF334155);
  static const Color neutral800 = Color(0xFF1E293B);
  static const Color neutral900 = Color(0xFF0F172A);
  static const Color neutral950 = Color(0xFF020617);

  // === Brand (vibrant violet — i-Willink default) ===
  static const Color brand50 = Color(0xFFF5F3FF);
  static const Color brand100 = Color(0xFFEDE9FE);
  static const Color brand200 = Color(0xFFDDD6FE);
  static const Color brand300 = Color(0xFFC4B5FD);
  static const Color brand400 = Color(0xFFA78BFA);
  static const Color brand500 = Color(0xFF8B5CF6);
  static const Color brand600 = Color(0xFF7C3AED);
  static const Color brand700 = Color(0xFF6D28D9);
  static const Color brand800 = Color(0xFF5B21B6);
  static const Color brand900 = Color(0xFF4C1D95);
  static const Color brand950 = Color(0xFF2E1065);

  // === Blue (ClubLink primary; clublink-platform Web + clubhouse Flutter で共有) ===
  static const Color blue50 = Color(0xFFEFF6FF);
  static const Color blue100 = Color(0xFFDBEAFE);
  static const Color blue200 = Color(0xFFBFDBFE);
  static const Color blue300 = Color(0xFF93C5FD);
  static const Color blue400 = Color(0xFF60A5FA);
  static const Color blue500 = Color(0xFF3B82F6);
  static const Color blue600 = Color(0xFF2563EB);
  static const Color blue700 = Color(0xFF1D4ED8);
  static const Color blue800 = Color(0xFF1E40AF);
  static const Color blue900 = Color(0xFF1E3A8A);
  static const Color blue950 = Color(0xFF172554);

  // === Green (clublink accent / success) ===
  static const Color green50 = Color(0xFFECFDF5);
  static const Color green100 = Color(0xFFD1FAE5);
  static const Color green500 = Color(0xFF10B981);
  static const Color green600 = Color(0xFF059669);
  static const Color green700 = Color(0xFF047857);

  // === AI-tech accents (i-Willink premium feel) ===
  static const Color cyan500 = Color(0xFF06B6D4);
  static const Color pink500 = Color(0xFFEC4899);
  static const Color sky50 = Color(0xFFF0F9FF);
  static const Color sky500 = Color(0xFF0EA5E9);

  // === Feedback ===
  static const Color red500 = Color(0xFFEF4444);
  static const Color red600 = Color(0xFFDC2626);
  static const Color amber500 = Color(0xFFF59E0B);
  static const Color amber600 = Color(0xFFD97706);

  // === fit-ai brand palette (existing palette preserved · 1:1 from app_theme.dart) ===
  /// fit-ai primary blue — same hex as [blue500].
  static const Color fitaiPrimary = Color(0xFF3B82F6);

  /// fit-ai secondary emerald (custom · not in shared palette).
  static const Color fitaiSecondary = Color(0xFF5CDCA8);

  /// fit-ai tertiary violet — same hex as [brand500].
  static const Color fitaiTertiary = Color(0xFF8B5CF6);

  // === Radius ===
  static const double radiusSm = 4.0; // 0.25rem
  static const double radiusMd = 8.0; // 0.5rem
  static const double radiusLg = 12.0; // 0.75rem
  static const double radiusXl = 16.0; // 1rem
  static const double radiusFull = 9999.0;

  // === Duration ===
  static const Duration durationFast = Duration(milliseconds: 150);
  static const Duration durationBase = Duration(milliseconds: 250);
  static const Duration durationSlow = Duration(milliseconds: 400);

  // === Easing ===
  static const Cubic easingStandard = Cubic(0.2, 0, 0, 1);
  static const Cubic easingEmphasized = Cubic(0.3, 0, 0, 1.1);
}
