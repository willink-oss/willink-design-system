# ADR-0001: Use class-variance-authority (cva) for variant management

- **Status**: Accepted
- **Date**: 2026-05-08
- **Phase**: 1

## Context

Phase 1 で 7 コンポーネント (Button / Badge / Input / Textarea / Label / Card / Accordion) を
実装するにあたり、各コンポーネントの variants (例: Button の default / outline / ghost / link)
と sizes (sm / md / lg) を扱う方式を決定する必要がある。

候補:
1. **インライン三項条件 + 巨大 className 連結文字列** — shadcn 初期型
2. **手書きの switch / record-based 変種マッピング** — 自前実装
3. **`class-variance-authority` (cva)** — TypeScript 推論 + variant API + compound variant 対応
4. **Stitches / styled-components 等の CSS-in-JS** — Tailwind v4 とは方向性が逆

## Decision

**`class-variance-authority` (cva) ^0.7.1 を採用**。

`buttonVariants = cva(base, { variants, defaultVariants })` パターンで variant + size を宣言的に管理。
`VariantProps<typeof buttonVariants>` で props 型推論を自動生成し、誤用 (存在しない variant 指定) を
コンパイル時に防ぐ。

## Rationale

- shadcn/ui の事実上の標準であり、保守者が将来別案件で見ても認知負荷が低い
- 1.4KB minified gzip。Phase 1 の DS バンドルへの追加コストは無視できる
- TypeScript 推論が強い (variant prop type が JSX 補完される)
- compound variant (variant × size の複合条件) を将来必要になった時にスムーズに拡張可能
- `cva` は **クラス文字列を返すだけ**。Tailwind v4 / preset / semantic token と一切ロックしない

## Consequences

### Positive
- variant 追加のコードレビューが宣言的に読める
- 型レベルで「存在しない variant」を弾ける
- shadcn 由来コードを参照しても `cva(base, ...)` のラインまでは概念的に同形

### Negative
- 1 個追加の dep (cva)
- compound variant の構文は初学者には一目で理解しにくい

### Mitigations
- `packages/react/README.md` で variant 追加例を 1 つは README 内に置く (Button が好例)
- `cn()` ユーティリティで cva 出力 + 追加 className を merge する1 行統一パターン
