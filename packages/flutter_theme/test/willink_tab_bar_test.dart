// Tests for WillinkTabBar (1.1.0).
//
// Cover brand color contracts (indicator / label / divider), tab switching,
// onTap callback wiring, ColorScheme override flow-through, and the
// PreferredSizeWidget contract for AppBar.bottom usage.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:willink_theme/willink_theme.dart';

void main() {
  const threeTabs = <Widget>[
    Tab(text: 'One'),
    Tab(text: 'Two'),
    Tab(text: 'Three'),
  ];

  Widget wrap(Widget child, {ThemeData? theme, int length = 3}) => MaterialApp(
        theme: theme ?? WillinkTheme.willink(),
        home: DefaultTabController(
          length: length,
          child: Scaffold(body: child),
        ),
      );

  group('WillinkTabBar — rendering', () {
    testWidgets('renders all tab labels', (tester) async {
      await tester.pumpWidget(wrap(const WillinkTabBar(tabs: threeTabs)));

      expect(find.text('One'), findsOneWidget);
      expect(find.text('Two'), findsOneWidget);
      expect(find.text('Three'), findsOneWidget);
    });

    testWidgets('slots into AppBar.bottom via preferredSize', (tester) async {
      const tabBar = WillinkTabBar(tabs: threeTabs);

      // PreferredSizeWidget contract must match the underlying TabBar.
      expect(
        tabBar.preferredSize,
        equals(const TabBar(tabs: threeTabs).preferredSize),
      );

      await tester.pumpWidget(
        MaterialApp(
          theme: WillinkTheme.willink(),
          home: DefaultTabController(
            length: 3,
            child: Scaffold(
              appBar: AppBar(title: const Text('設定'), bottom: tabBar),
            ),
          ),
        ),
      );
      expect(find.text('Two'), findsOneWidget);
    });
  });

  group('WillinkTabBar — brand colors', () {
    testWidgets('indicator + selected label use primary color',
        (tester) async {
      final theme = WillinkTheme.willink();
      await tester.pumpWidget(
        wrap(const WillinkTabBar(tabs: threeTabs), theme: theme),
      );

      final tabBar = tester.widget<TabBar>(find.byType(TabBar));
      expect(tabBar.indicatorColor, equals(theme.colorScheme.primary));
      expect(tabBar.labelColor, equals(theme.colorScheme.primary));
    });

    testWidgets('unselected label + divider follow theme colors',
        (tester) async {
      final theme = WillinkTheme.willink();
      await tester.pumpWidget(
        wrap(const WillinkTabBar(tabs: threeTabs), theme: theme),
      );

      final tabBar = tester.widget<TabBar>(find.byType(TabBar));
      expect(
        tabBar.unselectedLabelColor,
        equals(theme.colorScheme.onSurfaceVariant),
      );
      expect(tabBar.dividerColor, equals(theme.colorScheme.outlineVariant));
    });
  });

  group('WillinkTabBar — interaction', () {
    testWidgets('tap switches the selected tab on the controller',
        (tester) async {
      final controller = TabController(length: 3, vsync: const TestVSync());
      addTearDown(controller.dispose);

      await tester.pumpWidget(
        wrap(WillinkTabBar(controller: controller, tabs: threeTabs)),
      );
      expect(controller.index, equals(0));

      await tester.tap(find.text('Two'));
      await tester.pumpAndSettle();
      expect(controller.index, equals(1));
    });

    testWidgets('onTap fires with the tapped index', (tester) async {
      int? tappedIndex;
      await tester.pumpWidget(
        wrap(
          WillinkTabBar(
            tabs: threeTabs,
            onTap: (index) => tappedIndex = index,
          ),
        ),
      );

      await tester.tap(find.text('Three'));
      await tester.pumpAndSettle();
      expect(tappedIndex, equals(2));
    });
  });

  group('WillinkTabBar — dark theme (willinkDark)', () {
    testWidgets('labels/divider flip to dark roles; indicator stays brand-600',
        (tester) async {
      await tester.pumpWidget(
        wrap(
          const WillinkTabBar(tabs: threeTabs),
          theme: WillinkTheme.willinkDark(),
        ),
      );

      final tabBar = tester.widget<TabBar>(find.byType(TabBar));
      // brand is mode-invariant (ADR-0013) — same violet as light.
      expect(tabBar.indicatorColor, equals(WillinkPrimitives.brand600));
      expect(tabBar.labelColor, equals(WillinkPrimitives.brand600));
      // muted → neutral-400, border → neutral-800 dark flips.
      expect(
        tabBar.unselectedLabelColor,
        equals(WillinkPrimitives.neutral400),
      );
      expect(tabBar.dividerColor, equals(WillinkPrimitives.neutral800));
    });
  });

  group('WillinkTabBar — ColorScheme override', () {
    testWidgets('respects copyWith(colorScheme: ...) override', (tester) async {
      // Brand customization path per ADR-0011 era conventions: consumers
      // override ColorScheme to change the brand color.
      final overridden = WillinkTheme.willink().copyWith(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
      );

      await tester.pumpWidget(
        wrap(const WillinkTabBar(tabs: threeTabs), theme: overridden),
      );

      final tabBar = tester.widget<TabBar>(find.byType(TabBar));
      expect(tabBar.indicatorColor, equals(overridden.colorScheme.primary));
      expect(tabBar.labelColor, equals(overridden.colorScheme.primary));
    });
  });
}
