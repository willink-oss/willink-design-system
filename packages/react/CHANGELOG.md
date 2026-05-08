# Changelog

All notable changes to `@willink-labs/react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.1.0` for exact-minor stability).

## [0.2.2] — 2026-05-08

GitHub Packages → **npmjs.com に移行**。consumer 側 auth (PAT / NODE_AUTH_TOKEN /
.npmrc) を完全に不要化。**ADR-0006 起票**。

### Changed
- publish 先を `npm.pkg.github.com` → `registry.npmjs.org` に変更
- 全 3 パッケージの `publishConfig` から `registry` 行を削除 (default = npmjs.org)
- `.github/workflows/publish.yml`:
  - `registry-url: "https://registry.npmjs.org"` に変更
  - `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` (org-level secret) に変更
  - `permissions.packages: write` を削除 (npmjs は不要)
- `.npmrc` (DS リポ root) を削除 (元々 consumer ではないため不要)

### Why migrate?
GitHub Packages npm registry は、パッケージ visibility=public でも、リポジトリ
visibility=public でも、**install 時に常に PAT 認証を要求する** GitHub 仕様制約あり
(https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)。

willink-labs org は Enterprise plan で Package public 制限が初期設定されていた問題と、
GitHub Packages の token 必須仕様の二重制約があり、CEO が初 consumer
(clublink-platform) 移行時に PAT 運用の負荷を懸念。Phase 4 で複数 consumer に展開
する際の運用コスト線形増加を構造的に防ぐため npmjs.com に移行。

### Migration for consumers
```bash
# .npmrc は完全に削除可能 (registry 設定すら不要・default が npmjs.org)

pnpm add @willink-labs/react@^0.2.2 \
         @willink-labs/tailwind-preset@^0.2.2 \
         @willink-labs/tokens@^0.2.2
```

`NODE_AUTH_TOKEN` 環境変数 (Amplify / CI) は **完全に削除** 可能。

## [0.2.1] — 2026-05-08

Phase 3 着手中の運用負荷削減。consumer 側 PAT 設定 (NODE_AUTH_TOKEN) を不要にする。
**(注: GitHub Packages の auth 必須仕様により実効しなかった・0.2.2 で npmjs.com 移行)**

### Changed
- 全 3 パッケージの `publishConfig.access` を `restricted` → `public` に変更
- `.github/workflows/publish.yml` の publish コマンドを `--access public` に変更
- 全 3 パッケージのバージョンを **0.2.1** に bump

### Why public access?
private 配布では consumer 追加ごとに以下が発生:
1. 各 consumer リポの `.npmrc` に `_authToken=${NODE_AUTH_TOKEN}` 設定
2. 各 CI/CD (Amplify Console 等) に `NODE_AUTH_TOKEN` 環境変数追加
3. PAT 期限切れごとの全 consumer ローテーション

1 人会社の運用負荷 > パッケージ tarball 公開のリスク (リポ自体は private 維持・shadcn 拡張 + token 駆動なので競合優位性低) と判断。**ADR-0005 起票**。

### Migration for consumers
```bash
# .npmrc — auth 行を削除 (registry 行のみ残す)
@willink-labs:registry=https://npm.pkg.github.com

# package.json — version bump
pnpm add @willink-labs/react@^0.2.1 @willink-labs/tailwind-preset@^0.2.1 @willink-labs/tokens@^0.2.1
```

`NODE_AUTH_TOKEN` 環境変数 (Amplify / CI) は削除可能。

## [0.2.0] — 2026-05-08

Phase 3 着手前の hotfix リリース。

### Fixed
- `@willink-labs/react@0.1.0` の peerDependencies (`@willink-labs/tokens` / `@willink-labs/tailwind-preset`)
  は `workspace:*` で publish 時に `^0.0.1` に解決されたが、当該 2 パッケージは未 publish で
  consumer 側 `npm install` が失敗する状態だった。0.2.0 では tokens / tailwind-preset / react の
  3 パッケージを揃えて publish。

### Changed
- 全 3 パッケージのバージョンを **0.2.0** に揃える (tokens / tailwind-preset / react)
- `.github/workflows/publish.yml` で 3 パッケージを順次 publish

### Notes
- 0.1.0 → 0.2.0 は API 互換 (Component の signature 変更なし)
- consumer は `pnpm add @willink-labs/react@^0.2.0 @willink-labs/tailwind-preset@^0.2.0 @willink-labs/tokens@^0.2.0`

## [0.1.0] — 2026-05-08 [DEPRECATED — peerDeps 不整合により利用不可]

Initial usable release. Phase 1 ship (7 components). 0.2.0 で hotfix。

### Added
- `cn()` utility (clsx + tailwind-merge)
- `Button` — variants: `default` / `outline` / `ghost` / `link` × sizes: `sm` / `md` / `lg`
  - `asChild` prop for Next.js `<Link>` composition (Radix Slot)
- `Badge` — variants: `default` / `outline` / `success` / `warning` / `danger`
- `Input` — native input + `aria-invalid` based error styling
- `Textarea` — native textarea + `aria-invalid` based error styling
- `Label` — Radix Label + sizes (`sm` / `md`) + `required` prop (danger asterisk)
- `Card` — compound: `Card` / `CardHeader` / `CardTitle` / `CardDescription` /
  `CardContent` / `CardFooter` × variants `default` / `elevated`
- `Accordion` — Radix Accordion (Root / Item / Trigger / Content) + chevron animation +
  `single` / `multiple` modes
- 58 vitest tests + axe a11y assertion 0 violations
- shadcn 命名混入検知の regression test (`check-tokens.test.ts`)
- GitHub Packages publish workflow (`.github/workflows/publish.yml`)
- 4 ADR (`docs/adr/0001-0004-*.md`)

### Architecture decisions
- **cva** for variant management (ADR-0001)
- **Radix UI per-component** (slot / label / accordion only · meta-package 不採用) (ADR-0002)
- **tsup** for build (ESM only · es2022 · dts emit) (ADR-0003)
- **Publish to GitHub Packages at end of Phase 1** (= now) per "配布視点欠如" 過去失敗パターン回避 (ADR-0004)

### Constraints / non-goals
- Storybook 不採用 — `apps/playground` で代替
- Select / Dialog / Sheet / Tabs / Tooltip は Phase 1.5
- Flutter ThemeData は Phase 2
- (internal-site-1) brand axis (`(internal-site-1).json`) 追加は Level 3 別途承認

### Reference
- Postmortem of past 2 DS attempts (2024-01 / 2024-05): see
  `internal-repo/assets/knowledge/2026-05-07-design-system-archived-repos-postmortem.md`
- Phase 1 implementation plan: `~/.claude/plans/cozy-painting-rabbit.md`
