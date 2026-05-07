# Changelog

All notable changes to `@willink-labs/react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.1.0` for exact-minor stability).

## [0.1.0] — 2026-05-08

Initial usable release. Phase 1 ship (7 components).

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
