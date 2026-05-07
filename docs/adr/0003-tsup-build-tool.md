# ADR-0003: Use tsup (esbuild) for library build

- **Status**: Accepted
- **Date**: 2026-05-08
- **Phase**: 1

## Context

`@willink-labs/react` は GitHub Packages 経由で配布する npm ライブラリ。Phase 1 で必要な
ビルド要件:

- ESM 出力 (consumer は全て Next 15 + ESM)
- 型定義 (`.d.ts`) emit
- tree-shake 可能な chunk 分割
- sourcemap 同梱
- React JSX (automatic runtime) サポート
- 設定ファイル < 30 行で完結

## Decision

**tsup ^8.3.5 を採用**。

`tsup.config.ts` で以下を指定:
- `format: ["esm"]` (CJS 不採用 — consumer 全 ESM)
- `dts: true` (rollup-plugin-dts ベースで .d.ts 自動 emit)
- `splitting: true` (chunk 分割で sub-path import 最適化)
- `treeshake: true` (未使用 export の除去)
- `sourcemap: true`
- `external: ["react", "react-dom", "tailwindcss", "@willink-labs/*"]`
- `target: "es2022"`

## Alternatives considered

### `tsc` 単体
- ❌ JSX automatic runtime の出力が rspack/webpack/Next 15 SWC の期待と微妙にずれるケースあり
- ❌ tree-shake / chunk splitting が標準ではできない
- ❌ minify なし

### `vite` (library mode)
- 単純なライブラリには十分だが、SPA / Next.js 環境での server component 互換警告が出やすい
- Phase 1 範囲では tsup の方が config 行数が短い

### `Rollup` 単体
- 高度なカスタマイズが必要な大規模ライブラリには適切だが、Phase 1 規模では over-engineered

### `bun build`
- 速度は最も速いが、`.d.ts` emit が現状エクスペリメンタル
- consumer 環境 (pnpm + Node 20) と分離した tooling になるリスク

## Rationale

- tsup の設定行数 (12 行) が候補中最少。「ヤク剃り過多」失敗パターンの回避と整合
- esbuild バックエンドのため build 速度が早い (Phase 1 全 component で < 1 秒)
- shadcn / Radix 系ライブラリのほぼ全てが tsup でビルドされており、エコシステム整合性高い

## Consequences

### Positive
- ESM 4.59KB + dts 3.40KB という小さい配布物 (Phase 1 完了時点)
- Phase 1.5 で Select / Dialog / Sheet 追加時も entry を増やすだけで済む

### Negative
- tsup が将来 deprecated になった場合、Rollup 直書きへ移行コストあり (低優先度)
- minify を有効化していないため、consumer 側の bundler 最適化に依存する

### Mitigations
- 配布物サイズの監視は CHANGELOG.md にビルドサイズ記録を残す習慣で代替
- 必要になれば tsup の `minify: true` を後から追加するだけで対応可能
