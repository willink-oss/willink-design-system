import 'package:flutter/material.dart';

import '../tokens/spacing.dart';

/// Centered empty-state composition: icon + title + optional description + CTA.
///
/// Use whenever a screen has no data to show — instead of leaving an empty
/// page, present a clear next step.
///
/// ```dart
/// WillinkEmptyState(
///   icon: Icons.fitness_center,
///   title: 'まだトレーニング記録がありません',
///   description: '最初のワークアウトを記録してみましょう',
///   actionLabel: '記録を始める',
///   onAction: () => context.push('/workout/new'),
/// )
/// ```
///
/// Colors derive from `Theme.of(context).colorScheme` (icon = onSurfaceVariant,
/// title = onSurfaceVariant, description = outline) so the widget adapts to
/// the active brand axis automatically.
class WillinkEmptyState extends StatelessWidget {
  const WillinkEmptyState({
    required this.icon,
    required this.title,
    super.key,
    this.description,
    this.actionLabel,
    this.onAction,
    this.actionIcon,
  });

  /// Symbol shown above the title. Defaults to 80px size.
  final IconData icon;

  /// Primary message explaining what's missing.
  final String title;

  /// Optional supporting copy below the title.
  final String? description;

  /// CTA label. If null, no button is rendered.
  final String? actionLabel;

  /// Tap handler for the CTA. Required if [actionLabel] is set.
  final VoidCallback? onAction;

  /// Optional leading icon for the CTA. Defaults to [Icons.add].
  final IconData? actionIcon;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;
    final textTheme = theme.textTheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(WillinkSpacing.xxl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 80, color: colors.onSurfaceVariant),
            const SizedBox(height: WillinkSpacing.xl),
            Text(
              title,
              style: textTheme.headlineSmall?.copyWith(
                color: colors.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            if (description != null) ...[
              const SizedBox(height: WillinkSpacing.sm),
              Text(
                description!,
                style: textTheme.bodyMedium?.copyWith(color: colors.outline),
                textAlign: TextAlign.center,
              ),
            ],
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: WillinkSpacing.xxl),
              FilledButton.icon(
                onPressed: onAction,
                icon: Icon(actionIcon ?? Icons.add),
                label: Text(actionLabel!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
