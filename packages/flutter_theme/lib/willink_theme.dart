/// i-Willink Design System theme for Flutter.
///
/// Material 3 [ThemeData] factory. Since 0.5.0 the brand axis machinery
/// (WillinkBrand enum + per-brand factories) has been removed; the package
/// now ships a single `WillinkTheme.willink()` baseline. Consumers customize
/// brand color by overriding the resulting ColorScheme:
///
/// ```dart
/// import 'package:flutter/material.dart';
/// import 'package:willink_theme/willink_theme.dart';
///
/// MaterialApp(
///   theme: WillinkTheme.willink().copyWith(
///     colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
///   ),
///   home: ...,
/// );
/// ```
library;

export 'src/components/willink_bottom_sheet.dart' show WillinkBottomSheet;
export 'src/components/willink_button.dart'
    show WillinkButton, WillinkButtonSize, WillinkButtonVariant;
export 'src/components/willink_empty_state.dart' show WillinkEmptyState;
export 'src/components/willink_error_state.dart' show WillinkErrorState;
export 'src/components/willink_loading_state.dart' show WillinkLoadingState;
export 'src/components/willink_progress_indicator.dart'
    show WillinkProgressIndicator;
export 'src/components/willink_section_card.dart' show WillinkSectionCard;
export 'src/components/willink_snack_bar.dart'
    show WillinkSnackBar, WillinkSnackBarVariant;
export 'src/components/willink_tab_bar.dart' show WillinkTabBar;
export 'src/theme_data.dart' show WillinkTheme;
export 'src/theme_extensions/willink_brand_tokens.dart'
    show WillinkBrandTokens;
export 'src/tokens/primitive.dart' show WillinkPrimitives;
export 'src/tokens/semantic.dart' show WillinkSemantics;
export 'src/tokens/spacing.dart' show WillinkSpacing;
