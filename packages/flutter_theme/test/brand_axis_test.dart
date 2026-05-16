import 'package:flutter_test/flutter_test.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  group('WillinkBrand', () {
    test('has exactly 3 brands (willink/clublink/fitai)', () {
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

    test('all 3 brands carry subtleGradient + aiGradient (0.2.0+)', () {
      for (final tokens in [
        WillinkBrandTokens.willink,
        WillinkBrandTokens.clublink,
        WillinkBrandTokens.fitai,
      ]) {
        // subtle: white → brand-50 → sky-50 (3-stop)
        expect(tokens.subtleGradient.colors.length, 3);
        // ai: cyan → brand-500 → pink (3-stop)
        expect(tokens.aiGradient.colors.length, 3);
        expect(tokens.aiGradient.colors.first, WillinkPrimitives.cyan500);
        expect(tokens.aiGradient.colors.last, WillinkPrimitives.pink500);
      }
    });

    test('lerp interpolates the new gradient fields without throwing', () {
      final lerped = WillinkBrandTokens.willink.lerp(
        WillinkBrandTokens.clublink,
        0.5,
      );
      expect(lerped.subtleGradient.colors.length, 3);
      expect(lerped.aiGradient.colors.length, 3);
    });
  });
}
