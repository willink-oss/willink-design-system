// Token sync — verifies that WillinkPrimitives.* hex values match the
// canonical DTCG JSON in @willink-labs/tokens/src/primitive.json.
//
// 5/8 P0 (clublink.jp) traced back to a "single source of truth" violation:
// the React DS classes were emitted into JS but never compiled to CSS. This
// test gates the analogous failure for Flutter — if a Dart constant drifts
// from the JSON, CI fails before consumers can ship a regression.

import 'dart:convert';
import 'dart:io';

import 'package:flutter/painting.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  group('WillinkPrimitives mirrors primitive.json', () {
    final jsonFile = File('../tokens/src/primitive.json');
    if (!jsonFile.existsSync()) {
      // When run from a published tarball or detached workspace, the source
      // JSON is unavailable. Skip rather than fail spuriously.
      test('skipped — primitive.json not reachable from this checkout', () {});
      return;
    }
    final tokens = jsonDecode(jsonFile.readAsStringSync()) as Map<String, dynamic>;
    final colors = tokens['color'] as Map<String, dynamic>;

    int hexFromJson(String group, String shade) {
      final groupMap = colors[group] as Map<String, dynamic>;
      final shadeMap = groupMap[shade] as Map<String, dynamic>;
      final value = (shadeMap[r'$value'] as String).replaceFirst('#', '');
      return int.parse(value, radix: 16);
    }

    int rgbOf(Color c) => c.toARGB32() & 0xFFFFFF;

    test('neutral 50–950', () {
      expect(rgbOf(WillinkPrimitives.neutral50), hexFromJson('neutral', '50'));
      expect(rgbOf(WillinkPrimitives.neutral100), hexFromJson('neutral', '100'));
      expect(rgbOf(WillinkPrimitives.neutral200), hexFromJson('neutral', '200'));
      expect(rgbOf(WillinkPrimitives.neutral300), hexFromJson('neutral', '300'));
      expect(rgbOf(WillinkPrimitives.neutral400), hexFromJson('neutral', '400'));
      expect(rgbOf(WillinkPrimitives.neutral500), hexFromJson('neutral', '500'));
      expect(rgbOf(WillinkPrimitives.neutral600), hexFromJson('neutral', '600'));
      expect(rgbOf(WillinkPrimitives.neutral700), hexFromJson('neutral', '700'));
      expect(rgbOf(WillinkPrimitives.neutral800), hexFromJson('neutral', '800'));
      expect(rgbOf(WillinkPrimitives.neutral900), hexFromJson('neutral', '900'));
      expect(rgbOf(WillinkPrimitives.neutral950), hexFromJson('neutral', '950'));
    });

    test('brand 50–950', () {
      expect(rgbOf(WillinkPrimitives.brand50), hexFromJson('brand', '50'));
      expect(rgbOf(WillinkPrimitives.brand100), hexFromJson('brand', '100'));
      expect(rgbOf(WillinkPrimitives.brand200), hexFromJson('brand', '200'));
      expect(rgbOf(WillinkPrimitives.brand300), hexFromJson('brand', '300'));
      expect(rgbOf(WillinkPrimitives.brand400), hexFromJson('brand', '400'));
      expect(rgbOf(WillinkPrimitives.brand500), hexFromJson('brand', '500'));
      expect(rgbOf(WillinkPrimitives.brand600), hexFromJson('brand', '600'));
      expect(rgbOf(WillinkPrimitives.brand700), hexFromJson('brand', '700'));
      expect(rgbOf(WillinkPrimitives.brand800), hexFromJson('brand', '800'));
      expect(rgbOf(WillinkPrimitives.brand900), hexFromJson('brand', '900'));
      expect(rgbOf(WillinkPrimitives.brand950), hexFromJson('brand', '950'));
    });

    test('blue 50–950', () {
      expect(rgbOf(WillinkPrimitives.blue50), hexFromJson('blue', '50'));
      expect(rgbOf(WillinkPrimitives.blue500), hexFromJson('blue', '500'));
      expect(rgbOf(WillinkPrimitives.blue600), hexFromJson('blue', '600'));
      expect(rgbOf(WillinkPrimitives.blue700), hexFromJson('blue', '700'));
    });

    test('feedback / accents', () {
      expect(rgbOf(WillinkPrimitives.green500), hexFromJson('green', '500'));
      expect(rgbOf(WillinkPrimitives.green600), hexFromJson('green', '600'));
      expect(rgbOf(WillinkPrimitives.cyan500), hexFromJson('cyan', '500'));
      expect(rgbOf(WillinkPrimitives.pink500), hexFromJson('pink', '500'));
      expect(rgbOf(WillinkPrimitives.red600), hexFromJson('red', '600'));
      expect(rgbOf(WillinkPrimitives.amber600), hexFromJson('amber', '600'));
    });

    test('fit-ai brand alias hex matches blue/brand primitives', () {
      // fitaiPrimary === blue500 by design (single hex source of truth).
      expect(WillinkPrimitives.fitaiPrimary, WillinkPrimitives.blue500);
      // fitaiTertiary === brand500 by design.
      expect(WillinkPrimitives.fitaiTertiary, WillinkPrimitives.brand500);
    });
  });
}
