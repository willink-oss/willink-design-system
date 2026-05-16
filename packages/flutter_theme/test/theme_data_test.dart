import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  group('WillinkTheme.willink', () {
    test('returns Material 3 ThemeData', () {
      final theme = WillinkTheme.willink();
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.light);
    });

    test('primary == brand-600 violet (i-Willink default)', () {
      final theme = WillinkTheme.willink();
      expect(theme.colorScheme.primary, WillinkPrimitives.brand600);
    });

    test('carries a WillinkBrandTokens extension', () {
      final theme = WillinkTheme.willink();
      expect(
        theme.extension<WillinkBrandTokens>(),
        isNotNull,
        reason: 'WillinkBrandTokens extension missing',
      );
    });

    test('FilledButton uses StadiumBorder shape', () {
      final theme = WillinkTheme.willink();
      final shape = theme.filledButtonTheme.style?.shape?.resolve({});
      expect(shape, isA<StadiumBorder>());
    });

    test('copyWith ColorScheme allows brand override', () {
      // Consumers customize the brand color by overriding the colorScheme.
      // This is the new (0.5.0) public migration path replacing the prior
      // WillinkTheme.clublink() / .fitai() factories.
      final overridden = WillinkTheme.willink().copyWith(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
      );
      expect(overridden.colorScheme.primary, isNot(WillinkPrimitives.brand600));
    });
  });
}
