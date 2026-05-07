# ADR-0005: Switch from `restricted` to `public` package access

- **Status**: Accepted (supersedes part of ADR-0004)
- **Date**: 2026-05-08
- **Phase**: 3 (consumer 実証中の運用負荷削減)

## Context

Phase 1 で 3 パッケージ (`@willink-labs/tokens` / `@willink-labs/tailwind-preset` /
`@willink-labs/react`) を GitHub Packages に **`access: restricted`** で publish した。
restricted な package を install するには consumer 側で:

1. `.npmrc` に `_authToken=${NODE_AUTH_TOKEN}` を設定
2. CI/CD (Amplify Console / GitHub Actions 等) に `NODE_AUTH_TOKEN` 環境変数を追加
3. PAT 期限切れごとに全 consumer をローテーション

Phase 3 (clublink-platform 移行) で初めての consumer install を行った際、CEO が PAT 設定の
運用負荷を懸念。Phase 4 で i-willink.com 等に展開する際にも同じ設定が必要 → **consumer 数
× PAT ローテーション頻度** の運用コストが線形に増加することが明確になった。

## Decision

**全 3 パッケージの `publishConfig.access` を `restricted` → `public` に変更**。
`.github/workflows/publish.yml` の publish コマンドも `--access restricted` → `--access public` に変更。

バージョンは v0.2.0 → **v0.2.1** に bump して再 publish。

## Rationale

### 公開リスクの評価
- パッケージの内容: shadcn/ui 拡張 + Tailwind v4 token 駆動。**競合優位性が低い領域**
- ブランドカラー (vibrant violet / blue-green) は live サイト (i-willink.com / clublink.jp)
  で既に公開済 → token 公開で新たな機密漏洩は発生しない
- リポ自体は **private のまま継続** (ソースコード・ADR・PR・test コード・README は非公開)
- published tarball に含まれるのは `dist/` (minified ESM 8.3KB) + LICENSE + package.json + 簡易 README のみ

### 運用コスト削減
- consumer 側 `.npmrc`: registry 行のみで認証行不要
- CI/CD 環境変数: 削除可能 (`NODE_AUTH_TOKEN` 不要)
- PAT 期限切れ対応: 不要
- 新 consumer 追加時の onboarding: 1 行 `.npmrc` 追記のみ

### ADR-0004 との関係
ADR-0004 (Publish at end of Phase 1) は publish *タイミング* の決定で、access 設定の
決定ではなかった。本 ADR-0005 は ADR-0004 の補完として access モードを確定する。
ADR-0004 の核心 (= 過去 DS 失敗パターン「配布視点欠如」を構造的に防ぐため Phase 1 完了で
publish) は引き続き有効。

### Phase 1.5+ で OSS 化を検討する余地
public access は将来的な OSS 化 (社外公開) との親和性が高い。Phase 1.5 以降で adoption
状況を見て、OSS 化を別 ADR で判断する余地を残す (= 現状は private repo + public package
というハイブリッド形態で運用)。

## Consequences

### Positive
- consumer 追加コストが激減 (5 分 → 0 分)
- PAT ローテーション運用が消失
- Amplify / Vercel 等 PaaS で `.npmrc` テンプレートをそのまま使える
- 将来 OSS 化判断時の障壁が下がる (= 既に public access)

### Negative
- パッケージの dist tarball が anonymous で取得可能になる
- consumer リスト (ダウンロード元) が GitHub 側で集計されない (private なら集計可能)
  → 運用上の影響は軽微

### Mitigations
- リポ自体は private のまま維持 → ソースコード・PR・ADR は非公開
- 必要なら Phase 1.5 以降で OSS 化判断 (別 ADR)
- 万一機密性の高い primitive (例: 法人ロゴ画像 SVG) を扱う場合は package を分離して private 化を検討

## Migration

### DS 側
- v0.2.0 → v0.2.1 で publish (publishConfig.access: public)
- v0.2.0 (private) は GitHub Packages の Settings UI で削除 or visibility 変更 (任意)

### consumer 側 (clublink-platform)
- `.npmrc` から `_authToken=${NODE_AUTH_TOKEN}` 行削除 (registry 行のみ残す)
- `amplify.yml` から `npm config set //npm.pkg.github.com/:_authToken=$NODE_AUTH_TOKEN` 行削除
- Amplify Console から `NODE_AUTH_TOKEN` 環境変数削除 (任意・残しても害はない)
- `package.json` deps を `^0.2.1` に bump
- `npm install` で lockfile 更新

## References

- ADR-0004 (Publish at end of Phase 1): `./0004-publish-end-of-phase-1.md`
- Phase 3 完遂レポート: `internal-repo/assets/knowledge/2026-05-08-design-system-phase-3.md`
