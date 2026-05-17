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
| `@willink-labs/react` | shadcn/ui を semantic token に書き換えた React コンポーネント (0.8.0・**24 components**) |
| `willink_theme` (pub.dev) | Material 3 ThemeData + 4 Flutter components (EmptyState / ErrorState / LoadingState / SectionCard) + WillinkButton (0.5.0) |

## Quick start (consumer 側)

### 1. install (npmjs.org · auth 不要)

```bash
pnpm add @willink-labs/react @willink-labs/tailwind-preset @willink-labs/tokens
```

`.npmrc` 設定や PAT は **一切不要**。npmjs.org の public package として誰でも取得可能。

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

### Components shipped (0.8.0・npmjs.org public・24 components)

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

詳細: [`packages/react/README.md`](./packages/react/README.md) / [`packages/react/CHANGELOG.md`](./packages/react/CHANGELOG.md)

## Development

```bash
pnpm install
pnpm dev          # apps/playground を起動
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
- **v1.0.0** API 安定化 + 全 consumer 段階展開完了後 — 詳細は [`docs/roadmap/v1.0.md`](./docs/roadmap/v1.0.md)
  - `FormField` compound export は v1.0 範囲外。現状の `Input` + `Label` + Radix 組合せで十分との判断で v1.1+ 検討項目

## Accessibility

WCAG 2.1 AA compliance status per component is published in [`docs/a11y/matrix.md`](./docs/a11y/matrix.md). Motion behavior and `prefers-reduced-motion` strategy: [`docs/a11y/motion-contract.md`](./docs/a11y/motion-contract.md).

ADR: [`docs/adr/`](./docs/adr/)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, component guidelines, and release process. Security vulnerabilities: see [SECURITY.md](./SECURITY.md).

## License

MIT License — see [LICENSE](./LICENSE) for details.

Copyright (c) 2026 i-Willink LLC
