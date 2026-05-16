# ADR-0006: Migrate from GitHub Packages npm to npmjs.org

- **Status**: Accepted (supersedes ADR-0004 publish strategy)
- **Date**: 2026-05-08
- **Phase**: 3 (consumer 実証中の運用負荷ゼロ化)

## Context

ADR-0004 (Publish at end of Phase 1) と ADR-0005 (Switch to public package access)
は GitHub Packages npm registry に publish する前提で書かれた。Phase 3 で初 consumer
(clublink-platform) が install を試みた際、以下の制約が判明:

### 制約 1: GitHub Packages npm は常に auth 必須
GitHub Packages npm registry は、**パッケージや リポジトリの visibility に関係なく、
install 時に PAT 認証を要求する**。

実証 (2026-05-08 11:30 JST):
```
visibility=public package + anonymous request → HTTP 401 Unauthorized
visibility=public package + dummy token        → HTTP 401 Unauthorized
visibility=public package + valid PAT          → HTTP 200 OK
```

公式ドキュメント (https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry):
> "You need an access token to publish, install, and delete packages."

これは GitHub Packages npm の長年の仕様制約。container registry (ghcr.io) は anonymous
read access が可能だが、npm.pkg.github.com は対象外。

### 制約 2: willink-labs org Enterprise policy
willink-labs は Enterprise plan で「Package public 化」が org admin 設定により禁止されて
いた (`Setting is disabled by organization administrators`)。CEO が org 設定で許可後
公開化は可能になったが、上記制約 1 により auth 不要化は実現せず。

### 運用コスト試算
GitHub Packages 継続の場合、Phase 4 で N consumer に展開すると:
- N × (Amplify Console NODE_AUTH_TOKEN 設定 + PAT 期限切れローテーション)
- ローカル開発者ごとに `gh auth refresh -s read:packages`
- PAT 漏洩時の全 consumer ローテーション

## Decision

**GitHub Packages npm から npmjs.org に移行**。3 パッケージ (`@willink-labs/tokens` /
`@willink-labs/tailwind-preset` / `@willink-labs/react`) を v0.2.2 として
npmjs.org に re-publish。

### 実施手順
1. CEO が npmjs.com で `@willink-labs` org 取得 (Free plan・Public packages only)
2. CEO が Automation token を発行
3. CEO が GitHub Actions org-level secret として `NPM_TOKEN` を設定
4. COO が workflow を修正:
   - `registry-url: https://registry.npmjs.org`
   - `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`
   - `permissions.packages: write` 削除
5. COO が package.json から `publishConfig.registry` を削除 (default = npmjs.org)
6. tag v0.2.2 push → workflow → 3 packages publish to npmjs.org

### 効果
| 項目 | GitHub Packages | npmjs.org |
|---|---|---|
| consumer の `.npmrc` | registry 行 + `_authToken` 必須 | **完全に不要** |
| Amplify 環境変数 | `NODE_AUTH_TOKEN` 必須 (per consumer) | **不要** |
| CI/CD 設定 | per-consumer | **不要** |
| ローカル開発者の auth | `gh auth refresh -s read:packages` | **不要** |
| token ローテーション | per-consumer | **publish 側のみ (org secret 1 個)** |
| Phase 4 で N consumer 追加コスト | O(N) | **O(1)** |

## Rationale

### npmjs.org を選んだ理由
- **完全 anonymous read access**: public package は誰でも `npm install` 可能・auth 不要
- **デフォルト registry**: `.npmrc` に registry 行を書く必要すらない
- **Free for public packages**: organization account も無料
- **エコシステム標準**: shadcn / Radix / lucide / cva 等、依存している全 OSS が npmjs.org 上にある
- **Enterprise policy 不適用**: willink-labs GitHub Org の policy 制約を受けない

### GitHub Packages を完全に捨てない方針
- 既存 0.0.1 / 0.1.0 / 0.2.0 / 0.2.1 packages は GitHub Packages 上に残置 (履歴保持)
- 新規 0.2.2+ は npmjs.org 一本化
- 将来 GitHub Packages npm registry が anonymous read に対応した場合でも、再移行コストは低い (publish 先切替のみ)

### consumer 実装で得られる onboarding 体験

```bash
# Phase 4 で i-willink.com / 任意の新規 React app に展開時:
pnpm add @willink-labs/react @willink-labs/tailwind-preset @willink-labs/tokens
# ↑ これだけ。.npmrc 不要・auth 不要・Amplify 環境変数不要
```

## Consequences

### Positive
- consumer onboarding コスト = 1 コマンド
- Phase 4 で N consumer 追加時の運用コスト = 0
- PAT 期限切れの consumer 側影響 = ゼロ (publish 側のみ)
- OSS コミュニティの一般慣行と整合 (= 将来 OSS 化が容易)

### Negative
- npmjs.com の package 検索結果に表示される (= ブランド露出度↑・賛否両論)
- npmjs.com アカウント管理が増える (Org owner ≠ GitHub Org owner の可能性)
- npmjs.com は GitHub と独立した service なので、もし npmjs.com が長期障害・倒産した場合の影響あり

### Mitigations
- npmjs.com アカウントの 2FA 必須化 (CEO 側で設定)
- Automation token は read+publish のみ (delete 不可) → 万一漏洩でも被害最小化
- 半期に 1 回 NPM_TOKEN ローテーション (1 年無期限の Automation token を使うなら年 1 回)
- 万一の npmjs.com 障害時: GitHub Packages 経路は保持されているため fallback 可能

## Supersedes / relates to

- ADR-0004 (Publish at end of Phase 1): publish タイミングの判断は維持 (Phase 1 完了で publish)・publish 先のみ npmjs.org に変更
- ADR-0005 (Switch to public package access): GitHub Packages 上では public 化済 (履歴保持)・npmjs.org の access も `public` 維持

## References

- GitHub Packages npm registry 仕様: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
