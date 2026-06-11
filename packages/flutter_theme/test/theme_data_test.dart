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

  group('WillinkTheme.willinkDark', () {
    test('returns Material 3 ThemeData with Brightness.dark', () {
      final theme = WillinkTheme.willinkDark();
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.dark);
      expect(theme.colorScheme.brightness, Brightness.dark);
      // Scaffold sits on the dark surface, like the light factory does on
      // the light surface.
      expect(theme.scaffoldBackgroundColor, theme.colorScheme.surface);
    });

    test('flips surface roles to the dark neutral ladder (ADR-0013)', () {
      final scheme = WillinkTheme.willinkDark().colorScheme;
      expect(scheme.surface, WillinkPrimitives.neutral950); // bg
      expect(scheme.onSurface, WillinkPrimitives.neutral50); // fg
      expect(scheme.onSurfaceVariant, WillinkPrimitives.neutral400); // muted
      // surface-container ladder: subtle → muted → track.
      expect(scheme.surfaceContainerLow, WillinkPrimitives.neutral900);
      expect(scheme.surfaceContainerHigh, WillinkPrimitives.neutral800);
      expect(scheme.surfaceContainerHighest, WillinkPrimitives.neutral700);
      // border flip.
      expect(scheme.outline, WillinkPrimitives.neutral800);
      expect(scheme.outlineVariant, WillinkPrimitives.neutral800);
    });

    test('primary stays brand-600; containers and error flip', () {
      final scheme = WillinkTheme.willinkDark().colorScheme;
      // brand / brand-fg are mode-invariant by design (ADR-0013).
      expect(scheme.primary, WillinkPrimitives.brand600);
      expect(scheme.primary, WillinkTheme.willink().colorScheme.primary);
      expect(scheme.onPrimary, const Color(0xFFFFFFFF));
      // brand-soft / brand-soft-fg flip.
      expect(scheme.primaryContainer, WillinkPrimitives.brand950);
      expect(scheme.onPrimaryContainer, WillinkPrimitives.brand300);
      // danger flip.
      expect(scheme.error, WillinkPrimitives.red500);
    });

    test('carries a dark WillinkBrandTokens extension', () {
      final tokens =
          WillinkTheme.willinkDark().extension<WillinkBrandTokens>();
      expect(
        tokens,
        isNotNull,
        reason: 'WillinkBrandTokens extension missing',
      );
      // The white-anchored subtle gradient flips to the dark surface ladder
      // (bg → brand-soft → gradient-subtle-end, per ADR-0013)...
      expect(tokens!.subtleGradient.colors, const [
        WillinkPrimitives.neutral950,
        WillinkPrimitives.brand950,
        WillinkPrimitives.neutral900,
      ]);
      // ...while brand identity stays mode-invariant.
      final lightTokens =
          WillinkTheme.willink().extension<WillinkBrandTokens>()!;
      expect(tokens.brandGradient, lightTokens.brandGradient);
      expect(tokens.brandGlow, lightTokens.brandGlow);
      expect(tokens.shadowGlow, lightTokens.shadowGlow);
      // shadowSoft keeps its geometry but raises the black alpha for dark.
      expect(tokens.shadowSoft.single.color, const Color(0x66000000));
    });
  });
}
