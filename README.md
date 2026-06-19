# willink-design-system

[![npm version](https://img.shields.io/npm/v/@willink-labs/react.svg)](https://www.npmjs.com/package/@willink-labs/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/willink-oss/willink-design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/willink-oss/willink-design-system/actions/workflows/ci.yml)

i-Willink 企業デザインシステム。トークン駆動で全プロダクト (Next.js 群 / Flutter 群 / WordPress 群) のデザインルールを統一する。

## What is this

- **何を統一するか**: 配色 (brand / semantic) / タイポ / 角丸 / 影 / モーション / スペーシング
- **誰が consumer か**: i-willink.com / clublink-platform / その他自社プロダクト全般
- **どう配布するか**: npmjs.org public (`@willink-labs/*` scope・OIDC Trusted Publisher) + pub.dev (`willink_theme`・OIDC Trusted Publisher) — auth / PAT 不要

## Packages

| パッケージ | 役割 |
|---|---|
| `@willink-labs/tokens` | DTCG 互換 JSON でトークンを定義する単一ソース |
| `@willink-labs/tailwind-preset` | Tailwind v4 `@theme` で CSS 変数を吐く preset (willink baseline・consumer 側で `:root` override で色変更可) |
| `@willink-labs/css-tokens` | Framework-agnostic CSS variables 出力 (Tailwind 非ユーザー / Astro / Vue / Svelte 用)。**WordPress の公式 consumption path** ([ADR-0014](./docs/adr/0014-wordpress-consumption.md)・esperanza-wp-theme / wp-modern-starter-kit で pilot 済・専用 WP package は作らない) — 0.13.0 新設 |
| `@willink-labs/react` | shadcn/ui を semantic token に書き換えた React コンポーネント (**39 components**・Storybook catalog 付き) |
| `willink_theme` (pub.dev) | Material 3 ThemeData + **9 Flutter components** (Button / EmptyState / ErrorState / LoadingState / SectionCard / TabBar / BottomSheet / SnackBar / ProgressIndicator) — npm とは独立 versioning ([ADR-0011](./docs/adr/0011-flutter-independent-versioning.md)) |

## Quick start (consumer 側)

### 1. install (npmjs.org · auth 不要)

```bash
pnpm add @willink-labs/react@^1.0.0 \
         @willink-labs/tailwind-preset@^1.0.0 \
         @willink-labs/tokens@^1.0.0
# optional, for non-Tailwind consumers (WordPress / Astro / Vue / Svelte / plain CSS)
pnpm add @willink-labs/css-tokens@^1.0.0
```

`.npmrc` 設定や PAT は **一切不要**。npmjs.org の public package として誰でも取得可能。v1.0.0 以降は strict SemVer 2.0 ([ADR-0010](./docs/adr/0010-semver-policy.md)) — `^1.0.0` で MINOR / PATCH の自動更新が安全。

### 2. preset import (1 行で完結)

```css
/* app/globals.css */
@import "@willink-labs/tailwind-preset/preset.css";
```

That's it. **No `@source` directives required** in your CSS. The preset's
bundled `safelist.css` (auto-imported above) registers every DS component
class via Tailwind v4's `@source inline()` directive — these list class
names explicitly without depending on filesystem paths, so they work the
same whether your DS package is hoisted by pnpm, vendored by Turborepo,
or installed flat by npm.

If you previously added `@source ".../node_modules/@willink-labs/..."`
lines for 0.3.x, those continue to work but are no longer required. We
recommend removing them to keep your CSS clean.

### 3. コンポーネント使用

```tsx
import { Button, Badge } from "@willink-labs/react";

<>
  <Badge>NEW</Badge>
  <Button>Click</Button>
</>;
```

### 4. Customizing colors (single-brand baseline since 0.8.0)

DS は willink purple (`#7C3AED`) を baseline として ship。consumer が他色を使いたい場合は `:root` で `--color-brand` を override するだけで、scale 全段 (`brand-50`〜`brand-950`) と state tokens (hover / active / soft) が自動派生する (0.11.0+):

```css
/* your-app/globals.css */
@import "@willink-labs/tailwind-preset/preset.css";

:root {
  /* This single line drives the entire brand palette. */
  --color-brand: #2563eb;

  /* Optional: override these only if you want non-derived values. */
  --color-brand-fg:    #ffffff;                          /* text on primary */
  --color-brand-glow:  #3b82f6;                          /* shadow tint */
  --color-accent-cyan: #10b981;
  --color-accent-pink: #059669;
  --shadow-glow:       0 0 20px -5px rgba(37, 99, 235, 0.3);
}
```

That's it. The numeric scale (`brand-50` 〜 `brand-950`) and state tokens (`brand-hover` / `-active` / `-soft` / `-soft-fg`) all derive from `--color-brand` via `color-mix(in oklch, …)`. Every DS component and every consumer utility (`text-brand-600`, `bg-brand-soft` etc.) follows automatically — no per-step alias block, no missed steps.

> **Upgrading from 0.10.0?** This is a breaking change. Consumers that overrode `--color-brand` along with an 11-step alias block (`--color-brand-50: var(--color-blue-50)` etc.) can delete the alias block — the OKLCH derivation does the same job from a single override. Visual drift for the i-willink baseline is ~1–2% per channel (imperceptible on solids, subtle on long gradients). Browsers without `color-mix` support (pre-2023) fall back to the i-willink violet baseline via a `@supports` hex fallback emitted by Tailwind v4.

Flutter (Material 3) consumers do the equivalent by `copyWith`:

```dart
final theme = WillinkTheme.willink().copyWith(
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
);
```

### 5. Dark mode (v1.2+)

OS 設定に自動追従（`prefers-color-scheme`）。明示制御は `<html data-theme="dark">` / `"light"` を置くだけ — semantic token が flip し、全 component が `dark:` variant なしで追従する ([ADR-0013](./docs/adr/0013-dark-mode.md))。非 Tailwind consumer は `@willink-labs/css-tokens/tokens.dark.css` を追加 import。

#### Text emphasis ladder (v1.6 / 1.5.0+)

`fg`（最強の本文）と `muted`（最弱の補助）の間に **5 段の foreground emphasis role** を追加。Tailwind では `text-fg-strong` / `text-fg-emphasis` / `text-fg-secondary` / `text-fg-subtle` / `text-fg-faint`、非 Tailwind は `@willink-labs/css-tokens` の `--color-fg-*` 変数で消費。全段が neutral step alias なので dark mode で自動 flip する。contrast 契約は role 別（strong/emphasis ≥ 7 AAA、secondary ≥ 4.5 AA、subtle/faint は本文用途外の documented baseline）— 詳細は [ADR-0016](./docs/adr/0016-text-emphasis-roles.md)。consumer は自前の `text-neutral-*` / local `fg-*` を `text-fg-*` に置き換え可能。

```dart
// Flutter 側 (willink_theme 1.5.0+)
MaterialApp(
  theme: WillinkTheme.willink(),
  darkTheme: WillinkTheme.willinkDark(),
  themeMode: ThemeMode.system,
)
```

### Components shipped (npmjs.org public・39 components)

#### Phase 0-3 core set (7 components)

| Component | Variants / API | Headless |
|---|---|---|
| `Button` | default / outline / ghost / link × sm / md / lg | Radix Slot (asChild) |
| `Badge` | default / outline / success / warning / danger | — |
| `Input` | (`aria-invalid` で error border + focus ring) | native |
| `Textarea` | — | native |
| `Label` | sm / md (`required` で `*` 表示) | Radix Label |
| `Card` | default / elevated (compound: Header / Title / Description / Content / Footer) | — |
| `Accordion` | single / multiple + AccordionItem variant (flat / card / bordered) | Radix Accordion |

#### Phase 7+ expansion (14 components)

| Component | API / Notes | Headless |
|---|---|---|
| `Dialog` | size variants (sm / md / lg / 2xl) + brand-tinted overlay + DS motion | Radix Dialog |
| `AlertDialog` | destructive confirmation pattern + Action / Cancel buttons | Radix AlertDialog |
| `Avatar` | size sm / md / lg / xl + AvatarImage / AvatarFallback compound | Radix Avatar |
| `Tabs` | brand-aware indicator + animated active state | Radix Tabs |
| `Tooltip` | Provider + delayed-open fade animation | Radix Tooltip |
| `Toast` | Sonner wrapper with brand-tinted variants (success / error / info) | Sonner |
| `DropdownMenu` | Radix popover-style + Item / Label / Separator / CheckboxItem | Radix DropdownMenu |
| `Select` | trigger / content / item + brand focus ring | Radix Select |
| `Switch` | data-state translation animation + brand fill on check | Radix Switch |
| `Checkbox` | indicator content alignment + brand-fg check icon | Radix Checkbox |
| `RadioGroup` | flat / horizontal layout + brand fill on check | Radix RadioGroup |
| `Slider` | brand range + neutral track + disabled state | Radix Slider |
| `Progress` | brand-filled indicator + animated transitions | Radix Progress |
| `Separator` | horizontal / vertical orientation | Radix Separator |

#### 0.7.x additions (3 components)

| Component | API / Notes | Headless |
|---|---|---|
| `Skeleton` | rect / circle / text variants + animate-pulse | — |
| `Sheet` | top / right (default) / bottom / left side variants | Radix Dialog |
| `Toggle` | default / outline × sm / md / lg + controlled/uncontrolled | Radix Toggle |

#### v1.4 addition (1 component)

| Component | API / Notes | Headless |
|---|---|---|
| `FormField` | compound a11y wiring (Label / Control / Description / Error)・`id` / `htmlFor` / `aria-describedby` / `aria-invalid` 自動配線・error は `role="alert"` ([ADR-0015](./docs/adr/0015-formfield-api.md)) | Radix Slot |

#### v1.8.0 additions (14 components)

| Component | API / Notes | Headless |
|---|---|---|
| `Popover` | click-triggered floating panel (Trigger / Content / Anchor / Close / Portal)・`align` / `sideOffset` | Radix Popover |
| `ScrollArea` | custom scrollbar container (ScrollArea / ScrollBar)・orientation vertical / horizontal | Radix ScrollArea |
| `Spinner` | size sm / md / lg・`role="status"` loading indicator | — |
| `Empty` | size sm / md / lg・presentational empty-state container | — |
| `Kbd` | size sm / md・inline `<kbd>` key hint | — |
| `ButtonGroup` | orientation horizontal / vertical・`role="group"` segmented container | — |
| `Alert` | variant info / success / warning / danger・`role="alert"` inline banner | — |
| `Table` | compound native `<table>` (Header / Body / Row / Head / Cell / Caption) | — |
| `Pagination` | compound nav (Content / Item / Link / Previous / Next / Ellipsis)・built on `buttonVariants` | — |
| `Breadcrumb` | compound nav (List / Item / Link / Page / Separator)・asChild via Slot | Radix Slot |
| `ContextMenu` | right-click menu compound (11 parts・near-clone of DropdownMenu) | Radix ContextMenu |
| `HoverCard` | hover-triggered card (Trigger / Content / Portal) | Radix HoverCard |
| `Collapsible` | expand/collapse region (Trigger / Content) | Radix Collapsible |
| `ToggleGroup` | variant default / outline × size sm / md / lg × type single / multiple・built on `toggleVariants` | Radix ToggleGroup |

詳細: [`packages/react/README.md`](./packages/react/README.md) / [`packages/react/CHANGELOG.md`](./packages/react/CHANGELOG.md)

## Development

```bash
pnpm install
pnpm dev          # apps/playground を起動
pnpm -F willink-storybook dev  # Storybook (component catalog + addon-a11y)
pnpm -r build     # 全パッケージビルド
pnpm test         # Vitest
pnpm guardrails   # tooling 過剰チェック (過去頓挫パターン回帰防止)
```

## Governance

- **Level 3 (CEO 承認必須)**: primitive token 追加・baseline color 値変更
- **Level 2 (事後報告)**: semantic マッピング変更・既存コンポーネントの破壊的変更
- **Level 1 (即時実行)**: component token 追加・新コンポーネント追加・バグ修正・ドキュメント


## Why no husky / lint-staged / secretlint / markuplint

過去 2 回の DS 試行 (`i-Willink-LLC/i-Willink-Design-System` 2024-05・`Design-System-Development-bk` 2024-01) は両方とも tooling だけが充実して `src/` がほぼ空のまま停止した (= ヤク剃り過多)。本リポは **Phase 0 でこれらを意図的に入れない**。導入する場合は同 PR で生産的成果物 (token or component) を 1 個以上追加することを必須とする。


## Roadmap

- **Phase 0** ✅ token + Tailwind preset + playground
- **Phase 1** ✅ shadcn 拡張 7 components + npmjs.org publish (v0.2.2 / 2026-05-08)
- **Phase 3** ✅ 最初の consumer 実証 (clublink-platform / 5/8)
- **Phase 4.1** ✅ i-willink.com 移行 + auto-`@source` 仕組み確立
- **Phase 5.1-5.4** ✅ `willink_theme` Flutter package + 統合 pilot
- **Phase 6** ✅ Flutter 4 components (EmptyState / ErrorState / LoadingState / SectionCard)
- **Phase 7+** ✅ React 14 new components (Dialog / AlertDialog / Avatar / Tabs / Tooltip / Toast / Dropdown / Select / Switch / Checkbox / RadioGroup / Slider / Progress / Separator)
- **0.7.x** ✅ Skeleton / Sheet / Toggle (24 components total)
- **0.8.0** ✅ Single-brand baseline (brand axis machinery removed・consumer overrides via `:root` CSS variables)
- **Phase 8** ✅ OSS public 化 (MIT LICENSE / CONTRIBUTING / SECURITY)
- **0.9.0** ✅ Semantic brand state tokens (`--color-brand-hover` / `-active` / `-soft` / `-soft-fg`) — Button hover や Badge default が consumer override から外れる漏れを修正
- **0.10.0** ✅ Gradient utilities semantic-token 化 — `bg-gradient-*` が consumer `:root` override に追従
- **0.11.0** ✅ OKLCH-derived brand scale — consumer は `--color-brand` 1 行で 11-step palette 全部上書き
- **0.12.0** ✅ Role-based motion semantic tokens (`--duration-modal-enter` / `--duration-accordion` …) — interaction 単位の override 粒度
- **0.13.0** ✅ `prefers-reduced-motion` contract (全 animated component に `motion-reduce:animate-none` + preset CSS safety net + Sonner 取り込み) — WCAG 2.3.3 準拠。詳細は [`docs/a11y/matrix.md`](./docs/a11y/matrix.md) と ADR-0008
- **v1.0.0** ✅ API freeze cut (5 packages lockstep: `tokens` / `tailwind-preset` / `react` / `css-tokens` + Flutter 一回限り coincidence で `willink_theme`)
  - adopter 向け移行ガイド: [`docs/MIGRATION-0.8-to-1.0.md`](./docs/MIGRATION-0.8-to-1.0.md)
  - 1.0.0 以降の semver 運用: [ADR-0010](./docs/adr/0010-semver-policy.md) / Flutter は npm から独立: [ADR-0011](./docs/adr/0011-flutter-independent-versioning.md)
  - v1.1+ deferral: `FormField` compound / Dark mode / Storybook bootstrap / Flutter `WillinkTabBar` / `BottomSheet` / `SnackBar` / `ProgressIndicator` / `Popover` / `Combobox` / `Breadcrumb` / `Stepper`
- **v1.1** ✅ Storybook 10（24 components / addon-a11y）+ Flutter parity 4 components（TabBar / BottomSheet / SnackBar / ProgressIndicator → `willink_theme` 1.4.0）+ sonner 2 移行 + Slider a11y fix: [`docs/roadmap/v1.1.md`](./docs/roadmap/v1.1.md)
- **v1.2** ✅ Dark mode（`data-theme` 契約・semantic flip・contrast CI gate・`tokens.dark.css`・Storybook toggle・`WillinkTheme.willinkDark()` → `willink_theme` 1.5.0）+ Skeleton motion-reduce: [`docs/roadmap/v1.2.md`](./docs/roadmap/v1.2.md) / [ADR-0013](./docs/adr/0013-dark-mode.md)
- **v1.3** ✅ WordPress consumption（pilot 2 本: esperanza-wp-theme production + wp-modern-starter-kit canonical → 専用 WP package は不要と確定・css-tokens に root proxy files + 色なし `tokens.primitives.css` 追加。npm のみ lockstep 1.3.0、Flutter tag なし）: [`docs/roadmap/v1.3.md`](./docs/roadmap/v1.3.md) / [ADR-0014](./docs/adr/0014-wordpress-consumption.md)
- **v1.4** ✅ `FormField` compound（v1.0 Phase 9.1 audit 以来の最長 deferral を close。25th component: Label / Control (Radix Slot) / Description / Error の a11y 自動配線・`role="alert"` error・新規 runtime dep ゼロ + preset に `text-danger` safelist。npm のみ lockstep 1.4.0、Flutter tag なし）: [`docs/roadmap/v1.4.md`](./docs/roadmap/v1.4.md) / [ADR-0015](./docs/adr/0015-formfield-api.md)
- **v1.4.1** ✅ RSC fix（clublink-platform rollout で発覚: react dist に `'use client'` directive が無く Server Component からの import で `next build` が crash。tsup banner + treeshake off + dist 先頭 directive の build-output regression check を追加。npm のみ lockstep 1.4.1、Flutter tag なし）: [`packages/react/CHANGELOG.md`](./packages/react/CHANGELOG.md)
- **v1.5** ✅ Dark-mode consumer rollout（両 consumer production 2026-06-12: clublink-platform は computed-style probe 24/24・blue×dark composition 検証済み。i-willink.com は [PR #269](https://github.com/i-Willink-LLC/i-willink.com/pull/269) merge = production — 初回 dark visual sweep で 5 defect BLOCKED → 修正 → 再 sweep PASS で release、inspection gate が機能。DS 側 release はこの cycle 不要 — rollout が v1.2 の仕組みを消費。1.4.1 は rollout 発の臨時 PATCH）: [`docs/roadmap/v1.5.md`](./docs/roadmap/v1.5.md)
- **v1.6** ✅ `fg-*` text-emphasis roles upstreaming（i-willink.com が dark rollout で作った local foreground ladder を DS 公式 semantic role に昇格: `fg`/`muted` の間に `fg-strong`/`-emphasis`/`-secondary`/`-subtle`/`-faint` を追加・全段 neutral alias + dark flip・role 別 contrast 契約。`text-fg-*` utility で opt-in、React component 変更なし。npm のみ lockstep 1.5.0、Flutter tag なし）: [`docs/roadmap/v1.6.md`](./docs/roadmap/v1.6.md) / [ADR-0016](./docs/adr/0016-text-emphasis-roles.md)
- **v1.7** ✅ dark-mode link-contrast polish（#58: `Button variant="link"` の resting が固定 primitive `text-brand`=brand-600 で dark の `bg` 上 3.54:1 と AA 不合格 → flip する `text-brand-soft-fg` に変更し light 7.10 / dark 10.93 で両モード AAA。同じ「flip する surface 上の固定 brand 前景」bug class を DS 全体で監査し `AccordionTrigger` hover も `text-brand-hover` に修正・`RadioGroupItem` の dot は 1.4.11 の 3:1 を満たすため据え置き。contrast gate に required 2 pair 追加。`info-fg`(#59) は upstream 見送り=defer・issue open のまま。npm のみ lockstep 1.6.0、Flutter tag なし）: [`docs/roadmap/v1.7.md`](./docs/roadmap/v1.7.md) / [ADR-0017](./docs/adr/0017-dark-link-contrast-and-info-fg.md)
- **v1.8** ✅ dark-aware gradient text + bg-clip-text 監査 blind spot 解消（`text-gradient-primary` の `bg-clip-text` heading が固定 brand 端点 brand-600→brand-500 で dark の `bg` 上 worst 3.54:1 と AA 不合格 → preset-internal `--color-gradient-primary-from/-to` 導入で endpoint を dark-aware 化: light は byte-identical、dark は brand-300→brand-400 で worst 7.41:1。`scripts/check-contrast.mjs` に `TEXT_GRADIENTS` registry を追加し clipped-text gradient の worst endpoint を `bg` に対して dark required ≥4.5 / light report-only baseline で gate 化—CEO が手動で 2 回検出していた audit blind spot を CI で凍結、bad-endpoint で赤転を実証。accent-on-gradient は consumer 契約として [`docs/a11y/gradient-and-accent.md`](./docs/a11y/gradient-and-accent.md) に明文化。npm のみ lockstep 1.7.0、Flutter tag なし）: [`docs/roadmap/v1.8.md`](./docs/roadmap/v1.8.md) / [ADR-0018](./docs/adr/0018-gradient-accent-text-dark.md)
- **v1.9** ✅ extensibility — 14 new components (25→39) + CSS-first @layer components + self-hosted registry scaffold (npm lockstep 1.8.0, Flutter tag なし): docs/roadmap/v1.9.md

## Accessibility

WCAG 2.1 AA compliance status per component is published in [`docs/a11y/matrix.md`](./docs/a11y/matrix.md). Motion behavior and `prefers-reduced-motion` strategy: [`docs/a11y/motion-contract.md`](./docs/a11y/motion-contract.md).

ADR: [`docs/adr/`](./docs/adr/)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, component guidelines, and release process. Security vulnerabilities: see [SECURITY.md](./SECURITY.md).

## License

MIT License — see [LICENSE](./LICENSE) for details.

Copyright (c) 2026 i-Willink LLC
