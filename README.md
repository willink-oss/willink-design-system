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

```bash
pnpm add @willink-labs/tailwind-preset
```

```css
/* app/globals.css */
@import "@willink-labs/tailwind-preset/preset.css";
```

```html
<!-- ブランド軸切替 -->
<html data-brand="clublink">
  <button class="bg-brand text-brand-fg rounded-md px-4 py-2">Click</button>
</html>
```

**Brand 軸キーは 1 単語**: `willink` / `clublink` のようにハイフンを含めない (ダブルクリック選択・grep の取り回し優先)。新ブランド追加時も同方針。

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
- **Phase 1** shadcn 拡張 5-10 コンポーネント
- **Phase 2** Flutter ThemeData package
- **Phase 3** 最初の consumer 実証 (clublink-platform → i-willink.com)
- **Phase 4** 全プロダクト段階展開 → v1.0.0

詳細プラン: `~/.claude/plans/vectorized-juggling-hearth.md`
