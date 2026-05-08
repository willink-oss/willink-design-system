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
| `@willink-labs/flutter_tokens` | primitive.json から自動生成された Dart 定数 + ThemeData factory (Phase 2) |

## Quick start (consumer 側)

### 1. install (npmjs.org · auth 不要)

```bash
pnpm add @willink-labs/react @willink-labs/tailwind-preset @willink-labs/tokens
```

`.npmrc` 設定や PAT は **一切不要**。npmjs.org の public package として誰でも取得可能。

### 2. preset import + Tailwind v4 `@source` 設定 (必須)

```css
/* app/globals.css */
@import "@willink-labs/tailwind-preset/preset.css";

/* REQUIRED: Tell Tailwind v4 to scan DS sources.
 * Tailwind v4 excludes node_modules from default scanning, so without
 * these two @source lines the cva-emitted classes inside DS components
 * (bg-brand, shadow-brand-500/20, text-brand-fg, hover:bg-brand-700,
 * border-border, etc.) would never be compiled to CSS — components
 * would render with no brand colors / shadows / borders in production.
 *
 * This is being made automatic in @willink-labs/tailwind-preset@0.4.0
 * (Tailwind v4 plugin); until then, consumers must add these lines
 * themselves. Confirmed regression on clublink.jp 2026-05-08, hotfixed
 * same day in clublink-platform PR #19.
 */
@source "../../node_modules/@willink-labs/react/dist";
@source "../../node_modules/@willink-labs/tailwind-preset/src";
```

The `../../` paths assume `globals.css` lives at `apps/<app-name>/src/app/globals.css`
(standard Next.js / Tailwind v4 layout). Adjust the relative depth to match your
project — the targets are the two real folders inside `node_modules`.

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
- **Phase 2** Flutter ThemeData package
- **Phase 3** 🟡 最初の consumer 実証 (clublink-platform PR #18 起票・merge 待ち)
- **Phase 4** 全プロダクト段階展開 → v1.0.0

Phase 1 詳細プラン: [`~/.claude/plans/cozy-painting-rabbit.md`](file:///Users/yutaroshirai/.claude/plans/cozy-painting-rabbit.md)
Phase 1 ADR: [`docs/adr/`](./docs/adr/)
