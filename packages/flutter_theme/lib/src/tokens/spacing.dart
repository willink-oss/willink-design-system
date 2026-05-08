// Spacing tokens — Material 3 4-multiple scale for paddings / gaps / margins.
//
// Mirrors the React DS Tailwind spacing scale (consumer apps already use
// `gap-2`, `px-4`, etc. via the preset). On the Flutter side we expose them
// as concrete `double` values so widgets can write
// `EdgeInsets.all(WillinkSpacing.md)` without importing dart:ui.
//
// Why 4/8/16/24/32/48 (skipping 12): Material 3 recommends a 4-multiple scale
// and fits naturally with consumer apps that follow the same. fit-ai uses
// 12 as a sometimes-md value internally — fit-ai keeps that as a fit-ai-
// local concern and aliases the rest of its scale to WillinkSpacing.

class WillinkSpacing {
  const WillinkSpacing._();

  /// 4dp — minimum gap between adjacent elements (e.g. icon ↔ label).
  static const double xs = 4;

  /// 8dp — small gap (e.g. between chips, inside dense rows).
  static const double sm = 8;

  /// 16dp — default content padding (cards, list items, page edges).
  static const double md = 16;

  /// 24dp — section separator (between distinct content groups on a page).
  static const double lg = 24;

  /// 32dp — large gap (between page-level sections / hero blocks).
  static const double xl = 32;

  /// 48dp — extra-large gap (top-of-page padding, hero hero spacing).
  static const double xxl = 48;
}
