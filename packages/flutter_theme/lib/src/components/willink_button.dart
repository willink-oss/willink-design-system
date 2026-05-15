import 'package:flutter/material.dart';

/// Visual style of [WillinkButton].
///
/// Mirrors the React DS `Button` variant tokens.
enum WillinkButtonVariant {
  /// Solid primary background with brand glow shadow.
  filled,

  /// Transparent background with primary-colored border + text.
  outline,

  /// Transparent background with primary-colored text only.
  /// Hover/pressed shows a `primaryContainer` overlay.
  ghost,
}

/// Size axis of [WillinkButton]. Drives padding + font size.
enum WillinkButtonSize {
  /// 12×6 padding, 14px text.
  small,

  /// 16×10 padding, 16px text. Default.
  medium,

  /// 24×14 padding, 18px text.
  large,
}

/// Material 3 brand-aware button.
///
/// Mirrors the React DS `Button` component shape:
/// ```dart
/// WillinkButton(
///   onPressed: () => save(),
///   variant: WillinkButtonVariant.filled,
///   size: WillinkButtonSize.medium,
///   leadingIcon: const Icon(Icons.check),
///   child: const Text('保存'),
/// )
/// ```
///
/// Colors derive from `Theme.of(context).colorScheme` so the button follows
/// the active brand axis (willink / clublink / fitai) automatically.
///
/// Passing `onPressed: null` auto-disables the button (opacity 0.5 + no ripple).
class WillinkButton extends StatelessWidget {
  const WillinkButton({
    required this.onPressed,
    required this.child,
    super.key,
    this.variant = WillinkButtonVariant.filled,
    this.size = WillinkButtonSize.medium,
    this.leadingIcon,
    this.trailingIcon,
    this.fullWidth = false,
  });

  /// Tap handler. When `null`, the button is rendered in a disabled state
  /// (opacity 0.5 + no ripple).
  final VoidCallback? onPressed;

  /// Label content. Typically a [Text], but any widget is accepted.
  final Widget child;

  /// Visual variant. Defaults to [WillinkButtonVariant.filled].
  final WillinkButtonVariant variant;

  /// Size variant. Defaults to [WillinkButtonSize.medium].
  final WillinkButtonSize size;

  /// Optional icon shown to the left of [child] (8px gap).
  final Widget? leadingIcon;

  /// Optional icon shown to the right of [child] (8px gap).
  final Widget? trailingIcon;

  /// Whether the button should fill the available horizontal width.
  final bool fullWidth;

  EdgeInsets get _padding {
    switch (size) {
      case WillinkButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 6);
      case WillinkButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 10);
      case WillinkButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 24, vertical: 14);
    }
  }

  double get _fontSize {
    switch (size) {
      case WillinkButtonSize.small:
        return 14;
      case WillinkButtonSize.medium:
        return 16;
      case WillinkButtonSize.large:
        return 18;
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final disabled = onPressed == null;

    final textStyle = TextStyle(
      fontSize: _fontSize,
      fontWeight: FontWeight.w600,
      color: variant == WillinkButtonVariant.filled
          ? colors.onPrimary
          : colors.primary,
    );

    final children = <Widget>[
      if (leadingIcon != null) ...[
        leadingIcon!,
        const SizedBox(width: 8),
      ],
      DefaultTextStyle.merge(style: textStyle, child: child),
      if (trailingIcon != null) ...[
        const SizedBox(width: 8),
        trailingIcon!,
      ],
    ];

    final iconColor = variant == WillinkButtonVariant.filled
        ? colors.onPrimary
        : colors.primary;

    Widget button;
    switch (variant) {
      case WillinkButtonVariant.filled:
        button = FilledButton(
          onPressed: onPressed,
          style: FilledButton.styleFrom(
            backgroundColor: colors.primary,
            foregroundColor: colors.onPrimary,
            disabledBackgroundColor: colors.primary,
            disabledForegroundColor: colors.onPrimary,
            padding: _padding,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            minimumSize: Size.zero,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: Row(
            mainAxisSize:
                fullWidth ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: children,
          ),
        );
        break;
      case WillinkButtonVariant.outline:
        button = OutlinedButton(
          onPressed: onPressed,
          style: OutlinedButton.styleFrom(
            foregroundColor: colors.primary,
            disabledForegroundColor: colors.primary,
            side: BorderSide(color: colors.primary, width: 1.5),
            padding: _padding,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            minimumSize: Size.zero,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          child: Row(
            mainAxisSize:
                fullWidth ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: children,
          ),
        );
        break;
      case WillinkButtonVariant.ghost:
        button = TextButton(
          onPressed: onPressed,
          style: TextButton.styleFrom(
            foregroundColor: colors.primary,
            disabledForegroundColor: colors.primary,
            backgroundColor: Colors.transparent,
            padding: _padding,
            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            minimumSize: Size.zero,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
          ).copyWith(
            overlayColor: WidgetStateProperty.resolveWith((states) {
              if (states.contains(WidgetState.pressed) ||
                  states.contains(WidgetState.hovered)) {
                return colors.primaryContainer;
              }
              return null;
            }),
          ),
          child: Row(
            mainAxisSize:
                fullWidth ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: children,
          ),
        );
        break;
    }

    // IconTheme so leading/trailing Icon widgets inherit the right color/size
    // even when callers pass a bare `Icon(...)` without explicit color.
    Widget result = IconTheme.merge(
      data: IconThemeData(color: iconColor, size: _fontSize + 2),
      child: button,
    );

    if (variant == WillinkButtonVariant.filled && !disabled) {
      // Brand glow shadow: brand color at 30% alpha. Uses ColorScheme.primary
      // (not WillinkBrandTokens) so the glow tracks any brand the consumer
      // configures via WillinkTheme.fromBrand.
      result = DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: colors.primary.withValues(alpha: 0.3),
              blurRadius: 16,
              offset: const Offset(0, 4),
              spreadRadius: -2,
            ),
          ],
        ),
        child: result,
      );
    }

    if (disabled) {
      result = Opacity(opacity: 0.5, child: result);
    }

    if (fullWidth) {
      result = SizedBox(width: double.infinity, child: result);
    }

    return result;
  }
}
