# Changelog

All notable changes to `@willink-labs/tailwind-preset` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.2.0` for exact-minor stability).

## [0.5.0] — 2026-05-10

### Added — `animate-fade-in` / `animate-fade-out` 汎用 utility + 関連 safelist

`@willink-labs/react` の Tooltip / Dialog overlay / 将来 Popover 等で共用する
generic fade utility を `preset.css` に ship。 `--duration-fast` (150ms) +
`--ease-standard` で構成し、ブランドモーション統一。

```css
@keyframes willink-fade-in / willink-fade-out
@utility animate-fade-in / animate-fade-out
```

`safelist.css` に以下を追加 (Tooltip / Toast 用):
- `bg-neutral-{50,100,900}` / `text-neutral-50`
- `text-xs` / `px-3` / `py-1.5` / `rounded-md` / `shadow-md`
- `data-[state=delayed-open]:animate-fade-in` / `data-[state=closed]:animate-fade-out`
- `group-[.toaster]:bg-bg` 等 Sonner Toast の group selector pattern (8 entries)

### Added — Dialog animation utilities + safelist (`@willink-labs/react@0.5.0` Dialog 用)

`preset.css` に Dialog 用 keyframes + utilities を ship:

- `@keyframes willink-fade-in/out` (overlay backdrop fade)
- `@keyframes willink-dialog-in/out` (content scale + translate-50% 補正)
- `@utility animate-fade-in` / `animate-fade-out`
- `@utility animate-dialog-in` / `animate-dialog-out`

すべて DS motion token (`--duration-fast` 150ms / `--ease-standard`) を
使用し、ブランドモーション統一感を維持。Accordion keyframes (0.4.1) と
同じパターン (consumer 側 workaround を不要化)。

`safelist.css` に Dialog 用 layout / state-driven utilities を追加:

- positioning: `fixed` / `inset-0` / `z-50` / `bg-black/50` / `left-[50%]`
  / `top-[50%]` / `translate-x-[-50%]` / `translate-y-[-50%]`
- size variants: `max-w-{sm,md,lg,2xl}` / `max-w-[95vw]`
- close button: `absolute` / `right-4` / `top-4` / `rounded-sm` / `opacity-{70,100}`
- state-driven animations: `data-[state={open,closed}]:animate-{fade,dialog}-{in,out}`
- header/footer: `flex-col` / `flex-col-reverse` / `space-y-1.5` / `space-x-2` /
  `sm:flex-row` / `sm:justify-end` / `sm:text-left`

### Added — fit-ai brand axis (3rd brand on React/CSS side)

`[data-brand="fitai"]` ブロックを `preset.css` に追加し、fit-ai を React 側
3 番目のブランド軸として正規化。Flutter `WillinkBrand.fitai` (5/8 Phase 5.3
で確立) と完全 mirror。

- `--color-brand`: `#3b82f6` (blue-500・fitaiPrimary)
- `--color-brand-fg`: `#ffffff`
- `--color-brand-glow`: `#60a5fa` (blue-400)
- `--color-accent-cyan`: `#5cdca8` (fit-ai 独自 emerald・shared palette には無し)
- `--color-accent-pink`: `#8b5cf6` (brand-500 violet・cross-brand AI accent)
- `--shadow-glow`: blue-500 30% glow

新規 export:
- `@willink-labs/tailwind-preset/brands/fitai.css` (single-brand lock 用)
- `@willink-labs/tokens/brand/fitai.json` (codegen / TypeScript 値 import 用)

### Why now

- fit-ai (中核 SaaS) は Flutter 側で `WillinkBrand.fitai` が 5/8 既に稼働
- React/CSS 側未実装が 5/10 i-willink-crew DS 続行検討で gap として顕在化
- fit-ai 将来 Web 化 (admin / internal tool / staging dashboard 等) 時に
  brand axis があれば即座に DS 適用可能
- 「Flutter は揃ってるが React は揃ってない」二重メンテ状態を解消

### Lockstep version bump

- Bumped together with `@willink-labs/tokens@0.5.0` (`brand/fitai.json` 新規)
  and `@willink-labs/react@0.5.0` (code 変更なし・lockstep)。

### Added — safelist で AccordionItem variant + Trigger group/trigger を保証 (Issue #27 P1+P2)

`@willink-labs/react@0.5.0` で `AccordionItem` に variant prop (flat/card/bordered)・
`AccordionTrigger` に `group/trigger` named group + icon prop が追加。これに
伴い consumer の Tailwind v4 が node_modules を非スキャンの状況でも以下の
class が compile されるよう `safelist.css` に inline 登録:

- AccordionItem variant 用: `rounded-{md,xl}` / `shadow-{soft,md}` / `data-[state=open]:shadow-md` / `mb-{2,3}` / `last:mb-0` / `bg-bg`
- AccordionTrigger group: `group/trigger` / `group-data-[state=open]/trigger:rotate-180` / `group-data-[state=open]/trigger:hidden` / `group-data-[state=open]/trigger:block`

### Lockstep version bump
- Bumped together with `@willink-labs/tokens@0.5.0` and `@willink-labs/react@0.5.0`.



## [0.4.1] — 2026-05-10

### Fixed — Accordion アニメーションが consumer 側で動作しない問題 (Issue #27 P0)
- `@willink-labs/react` の `AccordionContent` は `data-[state=open]:animate-accordion-down`
  / `data-[state=closed]:animate-accordion-up` を emit していたが、`preset.css`
  に該当の `@keyframes` および `@utility` 定義を ship していなかったため、consumer
  全員でアコーディオン展開/折りたたみが瞬時切替になっていた。
- Fix:
  - `@keyframes accordion-down` / `accordion-up` を Radix の
    `--radix-accordion-content-height` 連動で追加。
  - `@utility animate-accordion-down` / `animate-accordion-up` を DS の motion
    token (`--duration-base` / `--ease-standard`) で構成。consumer 側のブランド
    モーション統一感を維持。
  - `safelist.css` に `data-[state={open,closed}]:animate-accordion-{down,up}`
    の `@source inline()` を追加し、Tailwind v4 の node_modules 非スキャン
    制約下でも consumer の CSS bundle に正しく compile されるよう保証。
- 影響: `clublink-platform` (Phase 3 で flat list のため気付かれず)、`i-willink.com`
  (Phase 4.1.1 で発見・consumer 側 globals.css に workaround を投入済)、(internal-site-1)
  (将来 DS 適用時)。consumer 側 workaround を 0.4.1 採用後に削除可能。

## [0.4.0] — 2026-05-08

### Added — `@source` is now automatic
- New `safelist.css` (auto-imported from `preset.css`) lists every DS
  component class via Tailwind v4's `@source inline()` directive. Because
  `@source inline()` takes class names rather than filesystem paths, the
  registration is portable across pnpm symlinks, npm tarballs, and
  Turborepo hoisting — the precise failure mode that caused the 5/8 P0
  regression on clublink.jp.
- `safelist.css` is also exposed via `package.json` `exports` so consumers
  can import it directly if they ever need the safelist without the rest
  of the preset.

### Changed — consumer setup is now one line
- `README` Quick Start: removed the two `@source ".../node_modules/..."`
  lines. The only required entry in the consumer's CSS is now:
  ```css
  @import "@willink-labs/tailwind-preset/preset.css";
  ```
- `preset.css` opening comment rewritten to reflect the one-line setup
  and to point at `safelist.css` for the maintenance contract.

### Backwards compatible
- Consumers that still have the legacy `@source` lines from 0.3.x will
  continue to build successfully — Tailwind treats duplicate registrations
  as idempotent. We will remove those lines from clublink-platform and
  i-willink.com in follow-up consumer PRs.

### Why this approach (not a JS plugin)
- The 0.3.0 changelog promised a "Tailwind v4 plugin that registers content
  paths via the JS plugin API". Tailwind v4's documented plugin surface
  does not expose programmatic content-path registration; the `@plugin`
  directive only loads legacy v3-style plugins. `@source inline()` (a CSS
  directive) is the v4-native mechanism for forcing class compilation, and
  it solves the path-portability problem that blocked the 0.3.0-rc embed.

### Lockstep version bump
- Bumped together with `@willink-labs/tokens@0.4.0` and `@willink-labs/react@0.4.0`
  to keep the three DS packages versioned as a single unit.

## [0.3.0] — 2026-05-08

### Documentation
- **Setup is now documented**. Consumers must add two `@source` lines next
  to their `@import` of `preset.css` so Tailwind v4 will scan the DS
  React-component built sources for cva-emitted classes. See README
  "Required @source setup" — without these lines, components render
  with no brand colors / shadows / borders in production. This caused
  a P0 regression on clublink.jp on 2026-05-08 (hotfixed same day in
  clublink-platform PR #19).

### Why this is documentation, not a code fix
A code-side fix attempted to embed the `@source` lines inside `preset.css`
itself (so consumers would only need the single `@import`), but the
relative-path resolution semantics are not portable across pnpm symlinks
and published npm tarballs. The fragile embed was reverted before publish.
A proper fix will land in `0.4.0` as a Tailwind v4 plugin that registers
content paths through the JS plugin API.

### Lockstep version bump
Bumped together with `@willink-labs/tokens@0.3.0` and `@willink-labs/react@0.3.0`
to keep the three DS packages versioned as a single unit.

## [0.2.7] — 2026-05-08

Initial public release on npmjs.org via OIDC Trusted Publisher. No CSS changes
versus 0.2.0 — the version bumps from 0.2.0 → 0.2.7 were all about getting the
publish pipeline working (GitHub Packages → npmjs.org → OIDC). See
`docs/adr/0006-npmjs-migration.md` and `docs/adr/0007-oidc-trusted-publisher.md`
for the full journey.

## [0.2.0] — 2026-05-07

### Added
- Initial token + brand-axis preset (i-willink default + clublink alt brand)
- `@theme` block exposing `--color-{neutral,brand,success,warning,danger}-*`
  primitives plus semantic aliases (`--color-bg`, `--color-fg`, `--color-border`,
  `--color-muted`, `--color-ring`).
- `[data-brand="willink"]` / `[data-brand="clublink"]` switching block.
