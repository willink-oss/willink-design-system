# ADR-0004: Publish to GitHub Packages at end of Phase 1, not Phase 3

- **Status**: Accepted
- **Date**: 2026-05-08
- **Phase**: 1

## Context

新 DS は Phase 3 で「最初の consumer 実証 (clublink-platform → i-willink.com)」を予定している。
Phase 3 で実 consumer に DS を導入する際、`@willink-labs/react` の取得方法は 2 つある:

1. **workspace link** — clublink-platform を本 DS リポにマージし、pnpm workspace で参照する
2. **GitHub Packages publish** — `@willink-labs/react@0.1.0` を npm registry 互換に公開し、
   clublink-platform 側は通常の `pnpm add` で取得する

## Decision

**Phase 1 完了時点で `0.1.0` を GitHub Packages (private) に publish する**。
Phase 3 を待たない。

## Rationale

過去 2 回の DS 試行 (`i-Willink-Design-System` 2024-05 / `Design-System-Development-bk`
2024-01) は両方とも **「配布視点欠如 (npm publish の形跡なし・他プロダクトからの import なし)」**
で頓挫した。Postmortem
の 3.3 章「配布・consumer 視点の欠如」より:

> 両リポとも npm publish の形跡なし・他プロダクトからの import なし。「DS リポ単体」で
> 完結し、`i-willink.com` や旧 fit-ai 等の実プロダクトと接続されていない。

Phase 3 まで publish を後ろ倒しすると、上記失敗パターンを **構造的に再生産** する:

- 「動くはず」と思っているコードが、実 consumer 環境で動かないケースが Phase 3 で初発覚
- workspace link の便利さが「単体完結 → 配布形態を後回しにしてよい」という錯覚を強化
- Phase 3 で publish 失敗が初検出されると、その時点で workflow / registry 設定 / token
  scope 等の調整が同時並行で発生し、Phase 3 の本来目的 (consumer 移行) と干渉する

Phase 1 完了で publish を強制することで:

- 「配布の通り道」の動作が Phase 1 範囲内で証明される
- Phase 3 開始時には `pnpm add @willink-labs/react@0.1.0` のワンコマンドで consumer 移行に
  入れる
- 本 ADR が CHANGELOG.md と組み合わさって、配布タイミングの判断履歴が永久に残る

## Strategy

`PR1: Skeleton + Distribution` で publish workflow (`.github/workflows/publish.yml`) を
**先に完成させる**。コンポーネント追加 PR は workflow が既に動く前提で進める。
PR1 で `pnpm publish --dry-run` を DoD に組み込み、tag push せずとも publish 失敗パターンを
早期検出する。

PR6 (本リリース PR) で:

1. version 0.0.1 → 0.1.0
2. CHANGELOG.md に 0.1.0 セクション
3. tag `v0.1.0` を push → workflow 自動発火 → GitHub Packages 登録
4. 別ディレクトリ (`/tmp/ds-consume-test`) で `npm install @willink-labs/react@0.1.0` を実行し
   実環境からの取得を確認

## Consequences

### Positive
- 過去 DS 失敗パターン「配布視点欠如」を Phase 1 内で構造的に潰す
- Phase 3 開始時に「workspace ↔ npm install」差分による事故が発生しない
- 0.1.0 → 0.2.0 の semver 運用が CHANGELOG.md とともに最初から確立

### Negative
- Phase 1 完了時点では実 consumer 移行の実証はまだ無いため、API breaking change を 0.2.0
  で行う必要が出る可能性 (= 0.x semver の minor は破壊的変更を許容する慣例で吸収)
- GitHub Packages の認証設定 (`.npmrc` + `GITHUB_TOKEN`) を全 consumer に展開する必要が出る

### Mitigations
- 0.x 期間は minor が破壊的変更を含むことを README / CHANGELOG に明記済 (`pnpm add ~0.1.0`
  でピン推奨)
- `.npmrc` の registry 設定はテンプレート化済 (PR1 で `.npmrc` を root に配置)
