import 'package:flutter_test/flutter_test.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  group('WillinkBrand', () {
    test('has exactly 3 brands (willink/clublink/fitai)', () {
      // (internal project) ((internal partner) delivered) is intentionally excluded — see PR notes.
      expect(WillinkBrand.values.length, 3);
      expect(
        WillinkBrand.values,
        containsAllInOrder([
          WillinkBrand.willink,
          WillinkBrand.clublink,
          WillinkBrand.fitai,
        ]),
      );
    });

    test('each brand maps to a non-null Material 3 ColorScheme', () {
      for (final brand in WillinkBrand.values) {
        final scheme = brand.toColorScheme();
        expect(scheme.brightness, isNotNull, reason: '$brand');
        expect(scheme.primary, isNotNull, reason: '$brand');
        expect(scheme.error, isNotNull, reason: '$brand');
      }
    });
  });

  group('WillinkBrandTokens', () {
    test('willink tokens use violet glow (brand-500)', () {
      expect(WillinkBrandTokens.willink.brandGlow,
          WillinkPrimitives.brand500);
    });

    test('clublink tokens use blue glow (blue-500)', () {
      expect(WillinkBrandTokens.clublink.brandGlow,
          WillinkPrimitives.blue500);
    });

    test('fitai tokens use fit-ai primary glow', () {
      expect(WillinkBrandTokens.fitai.brandGlow,
          WillinkPrimitives.fitaiPrimary);
    });
  });
}
