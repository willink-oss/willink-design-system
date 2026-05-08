import 'package:flutter_test/flutter_test.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  group('WillinkSpacing', () {
    test('exposes Material 3 4-multiple scale (no 12)', () {
      expect(WillinkSpacing.xs, 4);
      expect(WillinkSpacing.sm, 8);
      expect(WillinkSpacing.md, 16);
      expect(WillinkSpacing.lg, 24);
      expect(WillinkSpacing.xl, 32);
      expect(WillinkSpacing.xxl, 48);
    });

    test('all values are 4-multiples', () {
      const values = [
        WillinkSpacing.xs,
        WillinkSpacing.sm,
        WillinkSpacing.md,
        WillinkSpacing.lg,
        WillinkSpacing.xl,
        WillinkSpacing.xxl,
      ];
      for (final v in values) {
        expect(v % 4, 0, reason: '$v is not a 4-multiple');
      }
    });

    test('values are strictly increasing (xs < sm < md < lg < xl < xxl)', () {
      expect(WillinkSpacing.xs, lessThan(WillinkSpacing.sm));
      expect(WillinkSpacing.sm, lessThan(WillinkSpacing.md));
      expect(WillinkSpacing.md, lessThan(WillinkSpacing.lg));
      expect(WillinkSpacing.lg, lessThan(WillinkSpacing.xl));
      expect(WillinkSpacing.xl, lessThan(WillinkSpacing.xxl));
    });
  });
}
