# willink-design-system

i-Willink 企業デザインシステム。トークン駆動で全プロダクト (Next.js 群 / Flutter 群 / WordPress 群) のデザインルールを統一する。

## What is this

- **何を統一するか**: 配色 (brand / semantic) / タイポ / 角丸 / 影 / モーション / スペーシング
- **誰が consumer か**: i-willink.com / clublink-platform / internal-project-b / 今後の新規プロダクト全般 (※ (internal project) は顧客指定のため対象外)
- **どう配布するか**: GitHub Packages 経由で `@willink-labs/*` scope の npm パッケージ + Flutter package (Phase 2)

## Packages

| パッケージ | 役割 |
|---|---|
| `@willink-labs/tokens` | DTCG 互換 JSON でトークンを定義する単一ソース |
| `@willink-labs/tailwind-preset` | Tailwind v4 `@theme` で CSS 変数を吐く preset。`<html data-brand="clublink">` でブランド軸切替 |
| `@willink-labs/react` | shadcn/ui を semantic token に書き換えた React コンポーネント (Phase 1) |
| `willink_theme` (pub.dev) | Material 3 ThemeData + brand 軸 (`willink` / `clublink` / `fitai`) — Flutter 自社アプリ用 (Phase 5) |

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

### 3. brand 軸切替 + コンポーネント使用

```tsx
import { Button, Badge } from "@willink-labs/react";

<html data-brand="clublink">
  <Badge>NEW</Badge>
  <Button>Click</Button>
</html>;
```

**Brand 軸キーは 1 単語**: `willink` / `clublink` のようにハイフンを含めない (ダブルクリック選択・grep の取り回し優先)。新ブランド追加時も同方針。

### Phase 1 — components shipped (v0.2.2・npmjs.org public)

| Component | Variants | Sizes | Headless |
|---|---|---|---|
| `Button` | default / outline / ghost / link | sm / md / lg | Radix Slot (asChild) |
| `Badge` | default / outline / success / warning / danger | — | — |
| `Input` | — (`aria-invalid` で error) | — | native |
| `Textarea` | — | — | native |
| `Label` | — | sm / md (`required` で `*` 表示) | Radix Label |
| `Card` | default / elevated (compound: Header / Title / Description / Content / Footer) | — | — |
| `Accordion` | single / multiple | — | Radix Accordion |

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

- **Level 3 (CEO 承認必須)**: primitive token 追加・brand 軸追加・brand 値変更
- **Level 2 (事後報告)**: semantic マッピング変更・既存コンポーネントの破壊的変更
- **Level 1 (即時実行)**: component token 追加・新コンポーネント追加・バグ修正・ドキュメント

詳細: `internal-repo/standards/approval-levels.md`

## Why no husky / lint-staged / secretlint / markuplint

過去 2 回の DS 試行 (`i-Willink-LLC/i-Willink-Design-System` 2024-05・`Design-System-Development-bk` 2024-01) は両方とも tooling だけが充実して `src/` がほぼ空のまま停止した (= ヤク剃り過多)。本リポは **Phase 0 でこれらを意図的に入れない**。導入する場合は同 PR で生産的成果物 (token or component) を 1 個以上追加することを必須とする。

詳細: `internal-repo/assets/knowledge/2026-05-07-design-system-archived-repos-postmortem.md`

## Roadmap

- **Phase 0** ✅ token + Tailwind preset + playground (data-brand 切替確認)
- **Phase 1** ✅ shadcn 拡張 7 コンポーネント + npmjs.org publish (v0.2.2 / 2026-05-08・auth 不要)
- **Phase 1.5** Select / Dialog / Tabs / Tooltip / Sheet / Avatar / Separator (随時)
- **Phase 3** ✅ 最初の consumer 実証 (clublink-platform PR #18 merge / 5/8)
- **Phase 4** ✅ i-willink.com 移行 + DS 0.4.0 auto-`@source` (5/8)
- **Phase 5.1** 🟢 着手 — `willink_theme` Flutter package scaffold (本 PR)
- **Phase 5.3-5.4** fit-ai / clubhouse 統合 (別 PR)
- **v1.0.0** 全プロダクト段階展開後

> (internal project) ((internal partner) 受託) は Phase 5 対象外 (5/8 21:23 JST CEO 確定)。

Phase 1 詳細プラン: [`~/.claude/plans/cozy-painting-rabbit.md`](file:///Users/yutaroshirai/.claude/plans/cozy-painting-rabbit.md)
Phase 1 ADR: [`docs/adr/`](./docs/adr/)
