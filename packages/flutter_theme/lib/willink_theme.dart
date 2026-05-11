/// i-Willink Design System theme for Flutter.
///
/// Material 3 [ThemeData] factories with brand axes. Mirrors the React DS
/// `[data-brand="willink|clublink"]` pattern from `@willink-labs/tailwind-preset`.
///
/// Quick start:
/// ```dart
/// import 'package:flutter/material.dart';
/// import 'package:willink_theme/willink_theme.dart';
///
/// MaterialApp(
///   theme: WillinkTheme.clublink(),
///   home: ...,
/// );
/// ```
library;

export 'src/brand_axis.dart' show WillinkBrand;
export 'src/components/willink_empty_state.dart' show WillinkEmptyState;
export 'src/components/willink_error_state.dart' show WillinkErrorState;
export 'src/components/willink_loading_state.dart' show WillinkLoadingState;
export 'src/components/willink_section_card.dart' show WillinkSectionCard;
export 'src/theme_data.dart' show WillinkTheme;
export 'src/theme_extensions/willink_brand_tokens.dart'
    show WillinkBrandTokens;
export 'src/tokens/primitive.dart' show WillinkPrimitives;
export 'src/tokens/semantic.dart' show WillinkSemantics;
export 'src/tokens/spacing.dart' show WillinkSpacing;
