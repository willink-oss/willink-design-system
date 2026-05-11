import 'package:flutter/material.dart';

import '../tokens/primitive.dart';
import '../tokens/spacing.dart';

/// Section-shaped surface that hosts grouped content under an optional title.
///
/// Mirrors the React DS `Card` compound (`<Card><CardHeader>...</Card>`)
/// but in a single Flutter widget that takes `title` + optional `trailing`.
/// Background is `Theme.of(context).colorScheme.surface`; corner radius uses
/// [WillinkPrimitives.radiusLg]; shadow follows Material 3 elevation tint.
///
/// ```dart
/// WillinkSectionCard(
///   title: '今週のトレーニング',
///   trailing: const Icon(Icons.chevron_right),
///   onTrailingTap: () => context.push('/weekly'),
///   child: const Column(children: [...]),
/// )
/// ```
class WillinkSectionCard extends StatelessWidget {
  const WillinkSectionCard({
    required this.child,
    super.key,
    this.title,
    this.trailing,
    this.onTrailingTap,
    this.padding,
    this.margin,
  });

  /// Content rendered inside the card body. Required.
  final Widget child;

  /// Optional section title shown at the top of the card.
  final String? title;

  /// Optional widget shown right of the title (e.g. chevron, "more" link).
  /// Ignored when [title] is null.
  final Widget? trailing;

  /// Tap handler for [trailing]. Wrapped in [GestureDetector] so the trailing
  /// area is fully tappable.
  final VoidCallback? onTrailingTap;

  /// Inner content padding. Defaults to [WillinkSpacing.lg] on all sides
  /// (top adjusted when [title] is present, since the title already provides
  /// vertical breathing room).
  final EdgeInsetsGeometry? padding;

  /// Outer margin around the card. Defaults to [WillinkSpacing.lg] on all sides.
  final EdgeInsetsGeometry? margin;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Container(
      margin: margin ?? const EdgeInsets.all(WillinkSpacing.lg),
      decoration: BoxDecoration(
        color: colors.surface,
        borderRadius: BorderRadius.circular(WillinkPrimitives.radiusMd),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(
                WillinkSpacing.lg,
                WillinkSpacing.lg,
                WillinkSpacing.lg,
                WillinkSpacing.sm,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      title!,
                      style: textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  if (trailing != null)
                    GestureDetector(onTap: onTrailingTap, child: trailing),
                ],
              ),
            ),
          Padding(
            padding:
                padding ??
                EdgeInsets.fromLTRB(
                  WillinkSpacing.lg,
                  title != null ? 0 : WillinkSpacing.lg,
                  WillinkSpacing.lg,
                  WillinkSpacing.lg,
                ),
            child: child,
          ),
        ],
      ),
    );
  }
}
