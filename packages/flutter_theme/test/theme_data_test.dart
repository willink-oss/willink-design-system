import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  group('WillinkTheme.fromBrand', () {
    test('returns Material 3 ThemeData', () {
      final theme = WillinkTheme.fromBrand(WillinkBrand.willink);
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.light);
    });

    test('willink() primary == brand-600 violet', () {
      final theme = WillinkTheme.willink();
      expect(theme.colorScheme.primary, WillinkPrimitives.brand600);
    });

    test('clublink() primary == blue-600 (shared with clublink-platform Web)',
        () {
      final theme = WillinkTheme.clublink();
      expect(theme.colorScheme.primary, WillinkPrimitives.blue600);
    });

    test('fitai() primary == fit-ai blue (existing palette)', () {
      final theme = WillinkTheme.fitai();
      expect(theme.colorScheme.primary, WillinkPrimitives.fitaiPrimary);
      expect(theme.colorScheme.secondary, WillinkPrimitives.fitaiSecondary);
    });

    test('each brand returns a distinct primary color', () {
      final primaries = WillinkBrand.values
          .map((b) => WillinkTheme.fromBrand(b).colorScheme.primary)
          .toSet();
      expect(primaries.length, WillinkBrand.values.length);
    });

    test('every theme carries a WillinkBrandTokens extension', () {
      for (final brand in WillinkBrand.values) {
        final theme = WillinkTheme.fromBrand(brand);
        expect(
          theme.extension<WillinkBrandTokens>(),
          isNotNull,
          reason: 'brand $brand is missing WillinkBrandTokens',
        );
      }
    });

    test('FilledButton uses StadiumBorder shape', () {
      final theme = WillinkTheme.willink();
      final shape = theme.filledButtonTheme.style?.shape?.resolve({});
      expect(shape, isA<StadiumBorder>());
    });
  });
}
