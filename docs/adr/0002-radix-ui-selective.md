# ADR-0002: Adopt Radix UI primitives selectively (per-package, not meta-package)

- **Status**: Accepted
- **Date**: 2026-05-08
- **Phase**: 1

## Context

shadcn-style コンポーネントの a11y / 振る舞い (focus management / keyboard nav / aria) を担保
するために Radix UI primitive を導入する。Radix UI には 2 つの配布形態がある:

1. **Per-component packages** — `@radix-ui/react-slot` / `@radix-ui/react-label` /
   `@radix-ui/react-accordion` 等を必要分だけ install
2. **Meta-package** — `@radix-ui/react-primitives` で全コンポーネントを一括 install
3. **Theme package** — `@radix-ui/themes` で UI コンポーネントごと使う (DS 思想と衝突)

## Decision

**Per-component packages のみ採用**。Phase 1 で必要な以下 3 個に上限を引く:

- `@radix-ui/react-slot ^1.1.1` — Button の `asChild`
- `@radix-ui/react-label ^2.1.0` — Label の htmlFor 紐付け強化
- `@radix-ui/react-accordion ^1.2.2` — Accordion の Root / Item / Trigger / Content

`@radix-ui/themes` および meta-package は **不採用**。

## Rationale

- バンドルサイズの予測可能性: 個別 install なら使われていない primitive は dist に
  含まれず、tree-shake 不要で確実に excluded
- DS のスタイル方針 (Tailwind v4 + semantic token) と Radix Themes の prebuilt スタイルは
  衝突するため、Themes 系は採用不可
- Phase 1 で必要となる Radix primitive を 3 個に制限することで、ロードマップ「Phase 1 は
  shadcn 拡張 5-10 コンポーネント」の意図を尊重する (= 大量導入による複雑化を回避)

## Consequences

### Positive
- 各コンポーネントのバンドル影響が独立しており、Accordion を使わない consumer は
  Accordion の Radix 依存をロードしない
- DS が Radix のメジャーバージョンアップに対して 3 個ぶんしか追従コストを払わない

### Negative
- Phase 2+ で Dialog / DropdownMenu / Tooltip / Tabs を追加する際、毎回 1 dep 追加が必要
- 現状 3 個の制約は Phase 1 限定の運用ルール — Phase 1.5+ では制限を緩和する判断が必要

### Mitigations
- Phase 1.5 開始時に本 ADR をレビューし、ADR-0006 (TBD) で上限緩和ルールを別途記録する
- 「dep 追加時は同 PR で 1 コンポーネント以上 ship」を運用ルール化 (= guardrail script の
  思想を新 dep にも適用)
