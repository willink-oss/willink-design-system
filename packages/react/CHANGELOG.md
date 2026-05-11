# Changelog

All notable changes to `@willink-labs/react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.1.0` for exact-minor stability).

## [0.5.0] — 2026-05-10

### Added — Accordion API 拡張 (Issue #27 P1 + P2)

**`AccordionItem` に visual variant** (cva・後方互換)

\`\`\`tsx
<AccordionItem variant="card">  // "flat" (default) | "card" | "bordered"
\`\`\`

- `flat` (default・0.4.x 動作と同等): 横一列フラット list (`border-b`)
- `card`: rounded card 形式 (`rounded-xl border bg-bg shadow-soft mb-3`・open 時 `shadow-md`)
- `bordered`: 全周 border (`rounded-md border mb-2`)

variant 未指定時は `flat` が適用されるため**全 consumer 後方互換**。

**`AccordionTrigger` に icon prop** (後方互換)

\`\`\`tsx
<AccordionTrigger icon={<Plus />}>...</AccordionTrigger>
\`\`\`

- 未指定: 既存の `ChevronDown` (rotate-180 on open) — **0.4.x 動作と同等**
- 指定: custom icon を rendered as-is (rotation 等は consumer 制御)

trigger button に `group/trigger` named group を追加。consumer が
`group-data-[state=open]/trigger:` で trigger 状態に応じた表示切替を
descendant 要素から target 可能 (Plus/Minus 切替 pattern):

\`\`\`tsx
<AccordionTrigger
  icon={
    <>
      <Plus className="block group-data-[state=open]/trigger:hidden" />
      <Minus className="hidden group-data-[state=open]/trigger:block" />
    </>
  }
>
  Question
</AccordionTrigger>
\`\`\`

### Changed
- `AccordionItem` 内部実装が cva ベースに切替 (variant 拡張のため)。
  className override は 0.4.x と同様に動作 (cva 出力 + className が `cn()` で merge される)。
- `accordionItemVariants` を named export として追加 (consumer が variant の
  full class string を取得して composition したい場合のため)。

### Lockstep version bump
- `@willink-labs/tailwind-preset@0.5.0` (safelist に新 variant 用 utility 追加)
- `@willink-labs/tokens@0.5.0` (code 変更なし・lockstep)

### consumer 影響
- **i-willink.com**: PR #212 で AccordionPrimitive 直接利用していた箇所を
  0.5.0 採用後に DS API のみに置換可能 (`<AccordionTrigger icon={...} />`)
- **clublink-platform**: 既存 flat list は無変更で動作。card 化したい場合は
  `variant="card"` で opt-in
- **internal-project-b**: 将来 DS adopt 時に variant prop が活用可能

## [0.4.1] — 2026-05-10

### Changed
- **Lockstep version bump** with `@willink-labs/tailwind-preset@0.4.1`.
  `@willink-labs/react` 自体に code 変更なし。
- 0.4.1 採用で Accordion アニメーション (height keyframe + ease + duration)
  が consumer 側で自動動作するようになる (Issue #27 P0 fix・preset.css 側の
  bug fix を取り込むだけ)。

## [0.4.0] — 2026-05-08

### Changed
- **Lockstep version bump** with `@willink-labs/tailwind-preset@0.4.0` and
  `@willink-labs/tokens@0.4.0`. No code or API changes in this package —
  every component from 0.3.0 still ships with the same props and behavior.
- The auto-`@source` fix lives entirely in `@willink-labs/tailwind-preset`:
  consumers no longer need `@source ".../node_modules/@willink-labs/..."`
  lines next to their `@import` of `preset.css`. See the preset's CHANGELOG
  for the technical writeup.

### Why a coordinated minor bump
The three packages (tokens / tailwind-preset / react) are tightly coupled via
`peerDependencies: workspace:*`. Treating them as one versioned unit avoids
version-mismatch surprises when consumers do `pnpm add @willink-labs/react`.

## [0.3.0] — 2026-05-08

### Changed
- **Lockstep version bump** with `@willink-labs/tailwind-preset@0.3.0` and
  `@willink-labs/tokens@0.3.0`. The DS as a whole moves to 0.3.0 to make the
  preset.css fix (Tailwind v4 `@source` inclusion) easy to consume in a single
  deps bump on the consumer side.
- No code or API changes in this package — everything in 0.2.7 still works.
  The fix lives in `@willink-labs/tailwind-preset`.

### Why a coordinated minor bump
The three packages (tokens / tailwind-preset / react) are tightly coupled via
`peerDependencies: workspace:*`. Treating them as one versioned unit avoids
version-mismatch surprises when consumers do `pnpm add @willink-labs/react`.

## [0.2.7] — 2026-05-08

OIDC + token-free publish の最終確立版。0.2.6 で `npm publish` 直接実行により
`workspace:*` の peerDeps が tarball にそのまま published され consumer install
が `EUNSUPPORTEDPROTOCOL` で失敗。

### Changed
- `.github/workflows/publish.yml`:
  - publish step を `npm publish --access public` → `pnpm -F <pkg> publish --access public --no-git-checks` に変更
  - pnpm が publish 前に workspace:* を実バージョン (`^0.2.7` 等) に自動置換するため
    consumer 側で正常 install 可能になる
- 全 3 packages: 0.2.6 → 0.2.7

### CEO の本来の目的は引き続き達成
- ✅ token rotation 不要 (OIDC trusted publisher)
- ✅ 90 日期限切れ概念なし
- ✅ 監視 routine 不要
- ✅ 新 consumer 追加コスト 0

## [0.2.6] — 2026-05-08 [SUPERSEDED — workspace:* 解決漏れで consumer install fail]

OIDC Trusted Publisher で publish 確立 (token 完全廃止)。0.2.5 で発生した npmjs.com の
private repo 制約による provenance failure を回避。ただし `npm publish` 直接実行に
切替えたため pnpm の workspace 解決が走らず、peerDeps の `workspace:*` が tarball
にそのまま残り consumer install で `EUNSUPPORTEDPROTOCOL` 発生。0.2.7 で `pnpm publish`
経由に戻して解決。

### Changed
- `.github/workflows/publish.yml`:
  - `npm publish` から `--provenance` フラグを **削除**
    (provenance attestation は npmjs.com 仕様で source repo が public 限定)
  - `permissions.id-token: write` 維持 (OIDC ID token 発行に必要)
  - `NODE_AUTH_TOKEN` は引き続き不要 (token-free)
- 全 3 packages: 0.2.5 → 0.2.6

### Provenance attestation の扱い
- 現状: **不採用** (private repo 制約)
- 将来: Phase 4+ で OSS 化判断時に再検討 ((internal ADR) 候補)
- 影響: consumer は npmjs.com 上で「Built and signed on GitHub Actions」バッジを
  確認できないが、install 自体は通常通り動作

### CEO の本来の目的は達成
- ✅ token rotation 不要 (OIDC で publish ごと自動再発行)
- ✅ 90 日期限切れ概念なし
- ✅ 監視 routine 不要
- ✅ 新 consumer 追加コスト 0

## [0.2.5] — 2026-05-08 [SUPERSEDED — provenance + private repo の組合せで failed]

Plan B Phase 2: OIDC Trusted Publisher で publish (token 完全廃止)。
`--provenance` フラグが npmjs.com の private repo 制約で 422 エラー。0.2.6 で
provenance を諦めて OIDC Trusted Publisher だけで publish する形に修正。

### Changed
- `.github/workflows/publish.yml`:
  - publish step に `--provenance` フラグ復活 (Sigstore-based attestation 自動付与)
  - `NODE_AUTH_TOKEN: secrets.NPM_TOKEN` 削除 (= token authentication 完全廃止)
  - `permissions.id-token: write` 維持 (OIDC ID token 発行に必要)
- 全 3 packages: 0.2.4 → 0.2.5 (token-free publish 検証バージョン)

### CEO 既実施 (確認済)
- npmjs.com 各 package settings → Trusted Publisher を設定:
  - Repository: `willink-labs/willink-design-system`
  - Workflow: `publish.yml`
- Publishing access を「Require 2FA and disallow tokens (recommended)」に設定
  → Token publishing 完全拒否 / OIDC Trusted Publisher のみ許可

### Provenance attestation 自動付与
全 publish に Sigstore-based provenance が付与され、consumer は npmjs.com 上で
"Built and signed on GitHub Actions" バッジで供給元を検証可能。

### Post-verify cleanup
0.2.5 publish 動作確認後:
- GitHub Actions org-level secret `NPM_TOKEN` を削除可能
- npmjs.com の Granular access token (`willink-labs-publish-temporary`) を delete
- 以降は **token rotation 不要・期限切れ概念なし**・新 consumer 追加コスト 0

## [0.2.4] — 2026-05-08

Plan B: 初回 publish のみ Granular token (90 日) で実行 → 後続で OIDC 化。

### Changed
- workflow を一時的に token-based publish (`NODE_AUTH_TOKEN: secrets.NPM_TOKEN`) に戻す
- `--provenance` フラグ一時削除
- 全 3 packages: 0.2.3 → 0.2.4 (実 publish 用バージョン)

### 背景
0.2.3 で OIDC publish を計画したが、新規 org `willink-labs` には Trusted Publishers
タブが UI 上存在しなかった (4 タブ: Packages / Members / Teams / Billing のみ)。
npmjs.com の仕様で、Trusted Publisher 設定 UI は **既存 package が 1 つでも publish
された後にしか表示されない**。

打開策: ① 初回 publish を Granular token (90 日・bypass 2fa) で完遂 → ② package が
npmjs.com に存在する状態で各 package settings から Trusted Publisher 設定 → ③ 0.2.5 で
workflow を OIDC 化 (token 完全削除) という 3 段階 Plan B を採用。

### Next (0.2.5 で予定)
- npmjs.com で各 package settings → Trusted Publisher 設定 (CEO 手動)
- workflow に `--provenance` 復活 + `NODE_AUTH_TOKEN` 削除
- NPM_TOKEN secret 削除 → 期限切れ概念消滅 (CEO 指示「更新漏れが起きない仕組み」達成)

## [0.2.3] — 2026-05-08 [SUPERSEDED — Trusted Publisher UI 未表示で publish 未実行]

OIDC Trusted Publisher 採用予定だったが、新規 org に UI が表示されない仕様により
publish 未実行。0.2.4 で Plan B 経過版を release。

### Why
0.2.2 で npmjs.com publish に切替えたが、CEO の npmjs.com アカウント 2FA 有効化
により Classic Automation token では `403 Two-factor authentication required` で
publish failed。Granular access token は最大 90 日有効でローテーション運用が必要。

代替として GitHub Actions OIDC Trusted Publisher (npmjs.com 2024 GA) を採用。
**期限切れ概念がない短命 ID token** で publish 認証を行うため、token rotation 不要。
**ADR-0007 起票**。

### Changed
- `.github/workflows/publish.yml`:
  - `permissions.id-token: write` 追加 (OIDC 必須)
  - `pnpm -F <pkg> publish` → `npm publish --provenance --access public` (各 package dir)
  - `NODE_AUTH_TOKEN: secrets.NPM_TOKEN` 削除 (OIDC 認証で不要)
  - Node.js version 20 → 24 (deprecation warning 対応)
- 全 3 packages: 0.2.2 → 0.2.3 (publish 経路変更のため re-publish)

### Provenance attestation 自動付与
全 publish に **Sigstore-based provenance** が付与され、サプライチェーン安全性が向上。
consumer は npmjs.com 上で「Built and signed on GitHub Actions」バッジを確認可能。

### Migration for consumers
変更なし — install コマンドは 0.2.2 と同じ:
```bash
pnpm add @willink-labs/react@^0.2.3 @willink-labs/tailwind-preset@^0.2.3 @willink-labs/tokens@^0.2.3
```

## [0.2.2] — 2026-05-08 [SUPERSEDED — publish failed by 2FA]

GitHub Packages → **npmjs.com に移行**。consumer 側 auth (PAT / NODE_AUTH_TOKEN /
.npmrc) を完全に不要化。**ADR-0006 起票**。

(注: publish workflow run 25534973695 で 403 Two-factor authentication required で
失敗。0.2.3 で OIDC Trusted Publisher に移行して解決)

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
