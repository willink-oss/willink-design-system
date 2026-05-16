# ADR-0007: Adopt npmjs.com OIDC Trusted Publisher (eliminate token expiry)

- **Status**: Accepted (supersedes ADR-0006 NPM_TOKEN strategy)
- **Date**: 2026-05-08
- **Phase**: 3 (publish 認証の構造的改善)

## Context

ADR-0006 (Migrate to npmjs.org) で publish 認証を `NPM_TOKEN` (org secret) に切替えた
が、Phase 3 の v0.2.2 publish 試行で以下が発覚:

### 制約 1: 2FA enable + Classic Automation token 不可
CEO の npmjs.com アカウントは 2FA enable 済。Classic Automation token は **2FA bypass
不可** で publish 時 `403 Two-factor authentication required` を返す
(workflow run 25534973695 で確認)。

### 制約 2: Granular access token は最大 90 日
Classic token の代替として Granular access token (with bypass-2fa option) を使う場合、
**最大有効期限が 90 日**。期限切れごとに以下のローテーション運用が必要:

1. CEO がブラウザで npmjs.com にログイン
2. 旧 token を delete
3. 新 token を発行
4. GitHub Actions secret `NPM_TOKEN` を更新

CEO の指示 (2026-05-08): 「**更新漏れが起きない仕組み**を整備してください」。

## Decision

**npmjs.com OIDC Trusted Publisher (2024 GA) を採用**。token authentication を完全廃止。

### 仕組み
1. npmjs.com 側で「`willink-labs/willink-design-system` リポジトリの `publish.yml`
   workflow を信頼する」と設定 (Trusted Publisher)
2. workflow 実行時、GitHub Actions が **短命 OIDC ID token** を発行
3. npmjs.com が ID token の `iss` / `sub` クレームを検証 → trusted publisher と一致なら publish 許可
4. 認証は publish 中の数秒のみ有効。token は workflow 実行ごとに自動再発行

## Implementation

### CEO 手順 (5 分・1 回のみ)
1. https://www.npmjs.com にログイン
2. https://www.npmjs.com/settings/willink-labs/trusted-publishers
3. "Add Trusted Publisher" → "GitHub Actions"
4. 入力:
   - **Repository owner**: `willink-labs`
   - **Repository name**: `willink-design-system`
   - **Workflow filename**: `publish.yml`
   - **Environment**: (空欄 OK)
5. 3 packages 全て (tokens / tailwind-preset / react) に同じ trusted publisher 設定
   (UI に応じて per-package or org-level の選択)

### COO 手順 (workflow 修正)
- `permissions.id-token: write` 追加 (OIDC ID token 発行に必須)
- publish コマンドを `pnpm publish` → `npm publish --provenance` に変更 (各 package dir で実行)
- `NODE_AUTH_TOKEN: secrets.NPM_TOKEN` 削除
- Node.js version 20 → 24 (deprecation 対応)

### NPM_TOKEN secret の扱い
publish が OIDC で動作確認できたら、GitHub Actions org-level secret `NPM_TOKEN` は
**削除可能** (= 期限切れ概念が消滅)。

## Consequences

### Positive
- **token expiry 問題が構造的に消滅** (CEO 指示「更新漏れが起きない仕組み」を達成)
- 90 日サイクルの手動ローテーション運用が不要
- 監視 routine (例: `npm-token-expiry-watch`) も不要
- **Provenance attestation 自動付与** (Sigstore-based supply chain attestation)
  - consumer は npmjs.com 上で "Built and signed on GitHub Actions" バッジを確認可能
  - 万一 npmjs.com 側で改ざんされても、provenance hash で検出可能
- token 漏洩リスク = ほぼゼロ (短命 ID token は publish 中の数秒のみ有効)

### Negative
- npmjs.com 側で trusted publisher 設定が必要 (CEO 5 分・1 回のみ)
- 既存の `pnpm -F <pkg> publish` ワークフローが `npm publish` に変わる
  (`pnpm publish` は `--provenance` のサポート状況が不透明だったため `npm publish` 直接実行)
- workflow 失敗時のデバッグが OIDC レイヤー追加でやや複雑化

### Mitigations
- workflow run の log で OIDC token 発行とか trusted publisher 認証の詳細が出力されるため、
  failure 時はそこを起点にデバッグ可能
- 万一 OIDC が動かない場合の fallback として `NPM_TOKEN` secret は当面残置 (= 削除は動作確認後)
- npmjs.com docs: https://docs.npmjs.com/trusted-publishers

## Operational impact

| 項目 | 0.2.2 (NPM_TOKEN) | 0.2.3 (OIDC) |
|---|---|---|
| publish 認証 | NPM_TOKEN secret | GitHub OIDC ID token |
| Token 有効期限 | 90 日 (granular) | 数秒 (publish 中のみ) |
| ローテーション運用 | 90 日サイクル | **不要** |
| 監視 routine | 必要 | **不要** |
| 漏洩時被害 | 90 日間 publish 権 | publish 中の数秒のみ |
| Provenance | なし | **自動付与** |
| consumer 影響 | なし | なし (publish 側変更のみ) |

## Supersedes / relates to

- ADR-0006 (Migrate to npmjs.org): npmjs.com 採用は維持・auth 方式のみ OIDC に変更
- ADR-0005 (Public access): 維持 (publish時に `--access public` 指定)

## References

- npmjs.com Trusted Publishers docs: https://docs.npmjs.com/trusted-publishers
- GitHub OIDC docs: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
