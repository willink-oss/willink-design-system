// Tests for WillinkButton (0.4.0).
//
// Cover variant color contracts (filled / outline / ghost), disabled state
// behavior, brand axis switching, and leading-icon layout.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  Widget wrap(Widget child, {ThemeData? theme}) => MaterialApp(
        theme: theme ?? WillinkTheme.willink(),
        home: Scaffold(body: Center(child: child)),
      );

  group('WillinkButton — filled variant', () {
    testWidgets('uses primary background + onPrimary text color',
        (tester) async {
      final theme = WillinkTheme.willink();
      await tester.pumpWidget(
        wrap(
          WillinkButton(
            onPressed: () {},
            child: const Text('保存'),
          ),
          theme: theme,
        ),
      );

      final button = tester.widget<FilledButton>(find.byType(FilledButton));
      final style = button.style!;
      final bg = style.backgroundColor!.resolve(<WidgetState>{});
      final fg = style.foregroundColor!.resolve(<WidgetState>{});
      expect(bg, equals(theme.colorScheme.primary));
      expect(fg, equals(theme.colorScheme.onPrimary));
    });

    testWidgets('tap fires handler', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        wrap(
          WillinkButton(
            onPressed: () => tapped = true,
            child: const Text('OK'),
          ),
        ),
      );
      await tester.tap(find.text('OK'));
      expect(tapped, isTrue);
    });
  });

  group('WillinkButton — outline variant', () {
    testWidgets('border uses primary color', (tester) async {
      final theme = WillinkTheme.willink();
      await tester.pumpWidget(
        wrap(
          WillinkButton(
            variant: WillinkButtonVariant.outline,
            onPressed: () {},
            child: const Text('キャンセル'),
          ),
          theme: theme,
        ),
      );

      final button =
          tester.widget<OutlinedButton>(find.byType(OutlinedButton));
      final style = button.style!;
      final side = style.side!.resolve(<WidgetState>{});
      expect(side!.color, equals(theme.colorScheme.primary));
    });
  });

  group('WillinkButton — ghost variant', () {
    testWidgets('uses transparent background + primary text', (tester) async {
      final theme = WillinkTheme.willink();
      await tester.pumpWidget(
        wrap(
          WillinkButton(
            variant: WillinkButtonVariant.ghost,
            onPressed: () {},
            child: const Text('スキップ'),
          ),
          theme: theme,
        ),
      );

      final button = tester.widget<TextButton>(find.byType(TextButton));
      final style = button.style!;
      final bg = style.backgroundColor!.resolve(<WidgetState>{});
      final fg = style.foregroundColor!.resolve(<WidgetState>{});
      expect(bg, equals(Colors.transparent));
      expect(fg, equals(theme.colorScheme.primary));
    });
  });

  group('WillinkButton — disabled', () {
    testWidgets('opacity 0.5 + tap does not fire when onPressed null',
        (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        wrap(
          const WillinkButton(
            onPressed: null,
            child: Text('Disabled'),
          ),
        ),
      );

      final opacity = tester.widget<Opacity>(
        find.ancestor(
          of: find.byType(FilledButton),
          matching: find.byType(Opacity),
        ),
      );
      expect(opacity.opacity, equals(0.5));

      await tester.tap(find.text('Disabled'), warnIfMissed: false);
      // Ignore the tap silently — disabled buttons swallow taps.
      expect(tapped, isFalse);
    });
  });

  group('WillinkButton — ColorScheme override', () {
    testWidgets('respects copyWith(colorScheme: ...) override', (tester) async {
      // Migration path replacing the old per-brand factories: consumers
      // override ColorScheme to change the brand color.
      final overridden = WillinkTheme.willink().copyWith(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
      );

      await tester.pumpWidget(
        wrap(
          WillinkButton(
            onPressed: () {},
            child: const Text('Go'),
          ),
          theme: overridden,
        ),
      );

      final button = tester.widget<FilledButton>(find.byType(FilledButton));
      final bg = button.style!.backgroundColor!.resolve(<WidgetState>{});
      expect(bg, equals(overridden.colorScheme.primary));
    });
  });

  group('WillinkButton — dark theme (willinkDark)', () {
    testWidgets('filled keeps mode-invariant brand-600 bg + white text',
        (tester) async {
      // ADR-0013: brand identity does not flip — a filled button is the
      // same violet on a neutral-950 surface.
      await tester.pumpWidget(
        wrap(
          WillinkButton(
            onPressed: () {},
            child: const Text('保存'),
          ),
          theme: WillinkTheme.willinkDark(),
        ),
      );

      final button = tester.widget<FilledButton>(find.byType(FilledButton));
      final style = button.style!;
      final bg = style.backgroundColor!.resolve(<WidgetState>{});
      final fg = style.foregroundColor!.resolve(<WidgetState>{});
      expect(bg, equals(WillinkPrimitives.brand600));
      expect(fg, equals(const Color(0xFFFFFFFF)));
    });

    testWidgets('ghost overlay uses the dark brand-950 container',
        (tester) async {
      await tester.pumpWidget(
        wrap(
          WillinkButton(
            variant: WillinkButtonVariant.ghost,
            onPressed: () {},
            child: const Text('スキップ'),
          ),
          theme: WillinkTheme.willinkDark(),
        ),
      );

      final button = tester.widget<TextButton>(find.byType(TextButton));
      final overlay = button.style!.overlayColor!
          .resolve(<WidgetState>{WidgetState.pressed});
      // primaryContainer flips brand-100 → brand-950 under willinkDark.
      expect(overlay, equals(WillinkPrimitives.brand950));
    });
  });

  group('WillinkButton — icon layout', () {
    testWidgets('leadingIcon sits before label with 8px gap', (tester) async {
      await tester.pumpWidget(
        wrap(
          WillinkButton(
            onPressed: () {},
            leadingIcon: const Icon(Icons.check, key: ValueKey('lead')),
            child: const Text('完了'),
          ),
        ),
      );

      // 8px SizedBox spacer must exist between icon and label.
      final spacers = tester.widgetList<SizedBox>(find.byType(SizedBox)).where(
            (s) => s.width == 8 && s.height == null,
          );
      expect(spacers, isNotEmpty);

      // Icon center x should be less than label center x (i.e. on the left).
      final iconRect = tester.getRect(find.byKey(const ValueKey('lead')));
      final labelRect = tester.getRect(find.text('完了'));
      expect(iconRect.center.dx, lessThan(labelRect.center.dx));
    });
  });
}
