# Changelog

All notable changes to `@willink-labs/react` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows the **0.x semver convention** (minor bumps may include
breaking changes; pin with `~0.1.0` for exact-minor stability).

## [Unreleased]

### Added — `FormField` compound (25th component, ADR-0015)

`FormField` / `FormFieldLabel` / `FormFieldControl` / `FormFieldDescription` / `FormFieldError` (+ their `*Props` types) — the compound that automates the label/control/description/error a11y wiring consumers have hand-written since 0.1.0 (`id` / `htmlFor` / `aria-describedby` / `aria-invalid`). Deferred twice (v1.0 Phase 9.1 audit, v1.1) precisely to keep this surface minimal; API decisions in [ADR-0015](../../docs/adr/0015-formfield-api.md):

- `FormField` generates ids via `useId()` and provides them over context; it detects `FormFieldDescription` / `FormFieldError` among its **direct children** (render-time inspection — SSR-safe, no effects) so `aria-describedby` only ever references rendered nodes.
- `FormFieldControl` is a Radix `Slot` (existing dependency, zero new runtime deps): it injects `id`, the merged `aria-describedby` (consumer-supplied value + description + error, in that order) and `aria-invalid` onto any single control element — `Input`, `Textarea`, native elements, Radix triggers.
- `FormFieldError` renders only when it has content (safe to mount unconditionally as `<FormFieldError>{errors.x}</FormFieldError>`), carries `role="alert"` so dynamically appearing errors are announced, and drives the control's `aria-invalid` automatically (`invalid` prop on `FormField` as explicit override).
- `FormFieldLabel` wraps `Label` (size / `required` props unchanged) with `htmlFor` pre-wired.
- No CVA — no variants warranted. Class strings: `grid gap-2` / `text-sm text-muted` / `text-sm text-danger` (the latter newly safelisted in `@willink-labs/tailwind-preset`).

MINOR per [ADR-0010](../../docs/adr/0010-semver-policy.md) (new component + new exports).

## [1.3.0] — 2026-06-11

### Lockstep bump (no react source change)

Pair with `@willink-labs/css-tokens@1.3.0` (WordPress / legacy-toolchain consumption fixes per [ADR-0014](../../docs/adr/0014-wordpress-consumption.md): root-level proxy CSS files for plain-path resolvers like postcss-import, plus the color-free `tokens.primitives.css` export). No source change in this package — published to keep the lockstep version set aligned per the monorepo convention.

## [1.2.0] — 2026-06-11

### Changed — dark mode adaptation via semantic surface utilities (ADR-0013)

Every component that leaked primitive neutral utilities now rides the semantic surface roles introduced in `@willink-labs/tailwind-preset` (dark mode core, [ADR-0013](../../docs/adr/0013-dark-mode.md)): `bg-surface-subtle` / `bg-surface-muted` / `bg-track` / `bg-surface-inverted` + `text-surface-inverted-fg`. Zero `dark:` variants — the CSS variables flip, so every component now follows `data-theme="dark"` (and the `prefers-color-scheme` auto path) with no consumer action.

- **Light-mode rendering is pixel-identical**: the new tokens' light values resolve to the exact primitives the components used before (`neutral-50/100/200/900`).
- Migrated: `Button` (outline/ghost hover), `Toggle` (default/outline hover), `TabsList`, `Avatar` fallback, `Tooltip` (inverted surface), `Switch` unchecked track, `Slider` track, `Progress` track, `Skeleton`, `DropdownMenu` / `Select` item focus, `AlertDialog` cancel hover, `Toaster` cancelButton (paired safelist entry updated in the preset).
- The `bg-black/50` overlays (`Dialog` / `AlertDialog` / `Sheet`) are intentionally unchanged in both modes.
- The `check-tokens` regression gate now also forbids `bg-neutral-*` / `text-neutral-*` (any variant prefix) in component sources, so primitive leaks cannot come back.

### Added — Skeleton `motion-reduce:animate-none` variant

`Skeleton` now carries the component-side `motion-reduce:animate-none` variant next to `animate-pulse`, matching the house style of every other animated component (Dialog / Sheet / etc. carry the variant even though the preset has a CSS safety net) — closes the flag left open in 0.13.0.

## [1.1.0] — 2026-06-11

### Changed — Toast engine: sonner 1.7.4 → 2.0.7 (MINOR surface impact)

The underlying Toast library took a major bump, but the `@willink-labs/react` surface stays compatible — classified **MINOR** per [ADR-0010](../../docs/adr/0010-semver-policy.md):

- `toast` — type unchanged between sonner 1.7.4 and 2.0.7; `toast.promise` inputs additionally accept sonner's new extended-result objects (input widening, caller-compatible).
- `Toaster` — sonner 2.x removed two props; we keep them as deprecated compat props so no adopter code breaks at compile time:
  - `loadingIcon` (deprecated) — mapped onto `icons.loading`, behavior preserved. Prefer `icons={{ loading }}`.
  - `pauseWhenPageIsHidden` (deprecated) — **no-op**: sonner 2.x removed the feature entirely. Flagged here per the ADR-0010 behavior-change rule.
- `Toaster` additionally gains sonner 2.x's new optional props (`id`, and `toasterId` / `closeButtonAriaLabel` via `toastOptions`).
- The `prefers-reduced-motion` safety net in `@willink-labs/tailwind-preset` keeps working — sonner 2.x retains the `data-sonner-toaster` / `data-sonner-toast` attributes it targets.

### Fixed — Slider single-thumb accessible name (PATCH)

`Slider` now forwards the root `aria-label` to the thumb when there is exactly one thumb. Radix only auto-labels thumbs in multi-thumb ranges ("Minimum"/"Maximum"); a single thumb previously had no accessible name, failing axe `aria-input-field-name` — found by the Storybook a11y pass (#36). Multi-thumb ranges keep the Radix auto-labels. Restores the WCAG 4.1.2 status documented in [docs/a11y/matrix.md](../../docs/a11y/matrix.md).

## [1.0.0] — 2026-05-17

### API freeze (lockstep cut)

First stable release. The 24 components exported from `packages/react/src/index.ts` — their names, prop signatures, default values, and a11y semantics — are now part of the SemVer-2.0 contract. Adopters can pin `^1.0.0` and trust that MINOR / PATCH updates will not break their code per [ADR-0010](../../docs/adr/0010-semver-policy.md).

No content change vs. 0.13.0; this is the lockstep marker that pairs with `@willink-labs/tokens@1.0.0`, `@willink-labs/tailwind-preset@1.0.0`, and `@willink-labs/css-tokens@1.0.0`. Adopter migration: [`docs/MIGRATION-0.8-to-1.0.md`](../../docs/MIGRATION-0.8-to-1.0.md).

### Out of v1.0 scope (deferred to v1.1+)

- `FormField` compound export — current `Input` + `Label` + Radix combination is sufficient
- Dark mode variant — light-only ships first to keep the API surface fixed; dark mode is a separate design cycle
- Storybook 9 bootstrap (Phase 9.3 of the v1.0 roadmap) — deferred so the first-stable cut is not blocked by tooling. Apps/playground continues to serve as the visual reference
- `Popover` / `Combobox` / `Breadcrumb` / `Stepper` — not planned for 1.0; open a Discussion to propose

## [0.13.0] — 2026-05-17

### Added — `prefers-reduced-motion` contract on every animated component

`Dialog` / `AlertDialog` / `Sheet` / `Accordion` / `Tooltip` each carry a `motion-reduce:animate-none` (or `motion-reduce:transition-none` for the Accordion chevron) sibling next to their `animate-*` declaration. Combined with the CSS-level safety net in `@willink-labs/tailwind-preset@0.13.0` (which also collapses Sonner toast transitions), every DS animation now honors the user's OS-level `prefers-reduced-motion: reduce` setting — closes WCAG 2.3.3 for every component in the system except `Skeleton` (`animate-pulse`, flagged for 0.14.0).

See [`docs/a11y/matrix.md`](../../docs/a11y/matrix.md) for the full WCAG 2.1 AA compliance table and [`docs/a11y/motion-contract.md`](../../docs/a11y/motion-contract.md) for the override pattern. ADR-0008 records the design rationale.

### Test coverage

Added `motion-reduce:` class assertions to Dialog / AlertDialog / Sheet / Accordion (chevron + content) / Tooltip tests.

## [0.12.0] — 2026-05-17

### Changed — components ride semantic motion tokens (no behavioral change)

`Dialog` / `AlertDialog` / `Accordion` were rewired to the new role-based motion semantic tokens introduced in `@willink-labs/tailwind-preset@0.12.0` and `@willink-labs/tokens@0.12.0`. Visual feel is unchanged (alias chain resolves to the same primitive `duration-fast` / `duration-base` values) but consumers can now tune `--duration-modal-enter` / `--duration-accordion` independently of the rest of the system on `:root` to dial a single interaction class.

- `Dialog`: removed orphan `duration-200` class that was a no-op (no `transition` property bound to it). Motion is fully owned by the `animate-dialog-in/out` keyframe utilities in the preset.
- `AlertDialog`: same orphan removal.
- `Accordion`: chevron rotation hardcoded `duration-200` → semantic `duration-accordion` Tailwind utility (resolves to `--duration-base` = 250ms by default, was `200ms`). Chevron-rotation now follows the same role as the accordion height animation for consistent override surface area.

### Audited — no export changes in 0.12.0 (full freeze deferred to v1.0.0)

`packages/react/src/index.ts` was audited as part of the v1.0.0 prep; no exports changed in 0.12.0. The hard API freeze lands with the v1.0.0 release cut (see [`docs/roadmap/v1.0.md`](../../docs/roadmap/v1.0.md) Phase 9.6). `FormField` compound (Input + Label + Radix) remains deferred to v1.1+ — the current `Input` + `Label` combo is sufficient.

## [0.11.0] — 2026-05-17

### Lockstep bump (no React source change)

Pair with `@willink-labs/tailwind-preset@0.11.0` which makes the `--color-brand-{50…950}` scale OKLCH-derived from a single `--color-brand` axis. Consumers swapping the brand color now override one CSS variable instead of 11 — fixes the ClubLink purple regression (numeric scale steps that consumer code referenced directly, e.g. `text-brand-600`, were not overridable in 0.10.0 without an 11-line alias block). See the tailwind-preset CHANGELOG for full details and migration.

## [0.10.0] — 2026-05-17

### Lockstep bump (no React source change)

Pair with `@willink-labs/tailwind-preset@0.10.0` which migrates the gradient utilities (`bg-gradient-{subtle,primary,ai}` / `text-gradient-primary`) off primitive scale references so consumer `:root` overrides propagate into every gradient stop. See the tailwind-preset CHANGELOG for the full migration table.

## [0.9.0] — 2026-05-17

### Changed — components use semantic state tokens

Migrated `Button` (default + link variants), `AlertDialog` action, and `Badge` (default variant) off direct primitive scale references (`brand-700` / `brand-100` / `brand-500`) and onto the new semantic state tokens introduced in `@willink-labs/tailwind-preset@0.9.0`:

- `Button` default: `hover:bg-brand-700` → `hover:bg-brand-hover`, `shadow-brand-500/{20,40}` → `shadow-brand-glow/{20,40}`
- `Button` link: `hover:text-brand-700` → `hover:text-brand-hover`
- `AlertDialog` action: same migration as Button default
- `Badge` default: `bg-brand-100 text-brand-700` → `bg-brand-soft text-brand-soft-fg`

### Why

In 0.8.0 we removed the `data-brand` axis mechanism in favor of `:root` CSS variable overrides. But Button/Badge still referenced the willink-hardcoded primitive scale for hover/soft states, so consumers overriding `--color-brand` saw blue-on-rest but violet-on-hover. 0.9.0 closes that gap.

### Migration

No code change required on the React side. **However, if your consumer overrides `--color-brand` in `:root`, you must extend the override to include the new state tokens** (`--color-brand-hover`, `--color-brand-soft`, etc.). See `@willink-labs/tailwind-preset@0.9.0` CHANGELOG for the full override snippet.

### Verification
- 150 tests pass
- Badge tests updated for the new class names (`bg-brand-soft` / `text-brand-soft-fg`)

### Lockstep bump
- `@willink-labs/tokens@0.9.0` (lockstep, no source change)
- `@willink-labs/tailwind-preset@0.9.0` (new tokens added)

## [0.8.0] — 2026-05-16

### Lockstep bump

No source changes in `@willink-labs/react`. This release is part of a coordinated 0.8.0 bump across `@willink-labs/{tokens,tailwind-preset,react}` to align peer dependency versions after the brand-axis machinery was removed from `tokens` and `tailwind-preset`.

### Breaking (downstream, not in this package)

`@willink-labs/tailwind-preset` no longer exports `BRANDS` / `Brand`. `@willink-labs/tokens` no longer exports `BRANDS` / `BrandKey` / `BRAND_KEYS` / `tokens.brand` / `./brand/*.json` subpaths. If your code imported any of those, see `packages/tokens/CHANGELOG.md` and `packages/tailwind-preset/CHANGELOG.md` migration sections.

### Migration

```diff
- import { BRANDS, type Brand } from "@willink-labs/tailwind-preset";
+ // BRANDS removed in 0.8.0; DS is now single-brand baseline (willink).
+ // Customize colors via :root override in your globals.css:
+ //   :root { --color-brand: #2563eb; --color-brand-glow: #3b82f6; ... }
```

## [0.7.1] — 2026-05-16

### Added — Toggle component (1 new・24 total)

Toggle (Radix-based single press/depress button・toolbar primitive):
- variants: `default` (transparent → brand on `data-state=on`) / `outline` (bordered → brand border on)
- sizes: `sm` / `md` (default) / `lg`
- controlled via `pressed`/`onPressedChange` or uncontrolled via `defaultPressed`
- standard `disabled` state with opacity 0.5 + no pointer events

採用想定: 太字 / italic 等のテキスト書式トグル・filter pill・mobile UI の small selection state。

```tsx
import { Toggle } from "@willink-labs/react";

<Toggle aria-label="Toggle bold">B</Toggle>
<Toggle variant="outline" aria-label="Toggle italic">I</Toggle>
```

### Verification
- 150 tests pass (existing 145 + new 5 Toggle tests)
- pnpm -r build clean
- axe accessibility 0 violations (Radix Toggle primitive)
- Note: first publish from the new `willink-oss/willink-design-system` repository (post-OSS migration).

### Lockstep version bump
- Bumped together with @willink-labs/tailwind-preset@0.7.1 and @willink-labs/tokens@0.7.1 (additive・no breaking changes).

## [0.7.0] — 2026-05-14

### Added — Skeleton + Sheet components (2 new・23 total)

Skeleton (loading placeholder):
- variants: `rect` (default) / `circle` / `text`
- animate-pulse + bg-neutral-200

Sheet (side drawer・Radix Dialog ベース):
- side variants: `top` / `right` (default) / `bottom` / `left`
- compound exports: Sheet / SheetTrigger / SheetContent / SheetHeader / SheetTitle / SheetDescription / SheetFooter
- Dialog と同 motion token

採用想定: Skeleton 全 consumer (Loading state alternative) / Sheet mobile-first web (clubhouse 派生 web 等)。

### Lockstep version bump
- Bumped together with @willink-labs/tailwind-preset@0.7.0 and @willink-labs/tokens@0.7.0.

## [0.5.0] — 2026-05-10

### Added — Slider + Progress + Separator (utility 系 3 component)

#### Slider (Radix-based)
```tsx
<Slider defaultValue={[50]} max={100} step={1} aria-label="volume" />
<Slider defaultValue={[20, 80]} aria-label="range" />
```
- 単一値 / range 双方対応・thumb 数は value 配列長で自動判定
- track: `bg-neutral-200`・range: `bg-brand`・thumb: white circle with brand border
- キーボード矢印 / Home / End で値操作 (Radix 標準)

#### Progress (Radix-based)
```tsx
<Progress value={65} max={100} aria-label="upload" />
<Progress aria-label="loading" />  {/* indeterminate */}
```
- value 未指定時は indeterminate state
- bar: `bg-neutral-200`・indicator: `bg-brand` の transform translateX で表現
- data-state: `loading` / `complete` / `indeterminate` を Radix が自動制御

#### Separator (Radix-based)
```tsx
<Separator />                                  {/* horizontal (default) */}
<Separator orientation="vertical" className="h-6" />  {/* vertical */}
<Separator decorative />                       {/* role=none・semantic ではない */}
```
- 1px line・`bg-border`
- orientation prop で horizontal / vertical 切替
- decorative=true (default) で screen reader が無視 (装飾的 divider)

### Internal (test infra)
- `src/test-setup.ts` に `ResizeObserver` polyfill を追加 (Slider 内部で
  `@radix-ui/react-use-size` が ResizeObserver を要求し jsdom に未実装の
  ため・no-op class で fallback)。

### Lockstep version bump
- `@willink-labs/tailwind-preset@0.5.0` (utility 系 component 用 safelist)
- `@willink-labs/tokens@0.5.0` (code 変更なし・lockstep)


### Added — Avatar + Tabs + AlertDialog component family

#### Avatar (Radix-based)

```tsx
<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

- 画像読込失敗時に AvatarFallback (テキスト or icon) を自動表示
- default size `h-10 w-10`・className で override 可能
- 3 export: Avatar / AvatarImage / AvatarFallback

#### Tabs (Radix-based)

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account form</TabsContent>
  <TabsContent value="password">Password form</TabsContent>
</Tabs>
```

- Section navigation・active tab を `data-[state=active]` で表現
- `bg-neutral-100` の rail に `bg-bg` の active tab + `shadow-soft`
- キーボード矢印キーで tab 移動 (Radix 標準)
- 4 export: Tabs / TabsList / TabsTrigger / TabsContent

#### AlertDialog (Radix-based・Dialog の confirmation variant)

```tsx
<AlertDialog>
  <AlertDialogTrigger>削除</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
      <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>キャンセル</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>削除する</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Dialog (PR #31) との違い:

| 項目 | Dialog | AlertDialog |
|---|---|---|
| role | `dialog` | `alertdialog` (screen reader が緊急通知として読上げ) |
| Action / Cancel | optional | **必須** (誤操作防止) |
| Escape / overlay click | close する | **close しない** (Cancel button で明示的に閉じる) |
| 用途 | 一般的 modal (form / preview / detail) | destructive action 確認 (削除 / 解約 / 不可逆操作) |

11 export: AlertDialog / Trigger / Content / Action / Cancel / Header / Footer / Title / Description / Overlay / Portal。

### Lockstep version bump
- `@willink-labs/tailwind-preset@0.5.0` (Avatar / Tabs / AlertDialog 用 utilities + dialog scale keyframes)
- `@willink-labs/tokens@0.5.0` (code 変更なし・lockstep)


### Added — DropdownMenu + Select component family (Radix-based)

#### DropdownMenu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onSelect={openProfile}>Profile</DropdownMenuItem>
    <DropdownMenuItem>
      Settings <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem disabled>Billing</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Exports: `DropdownMenu` / `DropdownMenuTrigger` / `DropdownMenuContent` /
`DropdownMenuItem` / `DropdownMenuLabel` / `DropdownMenuSeparator` /
`DropdownMenuShortcut` / `DropdownMenuGroup` / `DropdownMenuPortal` /
`DropdownMenuSub` / `DropdownMenuRadioGroup`。

`DropdownMenuItem` / `DropdownMenuLabel` には `inset?: boolean` prop
(checkbox / radio item 用の左マージン)。

#### Select

```tsx
<Select onValueChange={setPlan}>
  <SelectTrigger><SelectValue placeholder="Choose plan" /></SelectTrigger>
  <SelectContent>
    <SelectLabel>Plans</SelectLabel>
    <SelectItem value="standard">Standard</SelectItem>
    <SelectItem value="premium">Premium</SelectItem>
    <SelectSeparator />
    <SelectItem value="enterprise">Enterprise</SelectItem>
  </SelectContent>
</Select>
```

Exports: `Select` / `SelectTrigger` / `SelectValue` / `SelectContent` /
`SelectItem` / `SelectLabel` / `SelectSeparator` / `SelectGroup`。

- Trigger: `h-10 w-full` の Input 風 button + ChevronDown icon
- Content: `position="popper"` (default) で trigger 直下に配置・width 自動追従
  (`min-w-[var(--radix-select-trigger-width)]`)
- Item: 左に Check icon (現在選択中のみ表示・absolute positioning)

### Internal (test infra)
- `src/test-setup.ts` に jsdom 用 polyfill 追加: `Element.prototype.hasPointerCapture` /
  `setPointerCapture` / `releasePointerCapture` / `scrollIntoView` (Radix Select /
  Tooltip 等の pointer 系イベントが jsdom で `TypeError` を投げる問題を解消)。

### Lockstep version bump
- `@willink-labs/tailwind-preset@0.5.0` (DropdownMenu / Select 用 utilities + 汎用 fade keyframes)
- `@willink-labs/tokens@0.5.0` (code 変更なし・lockstep)


### Added — Form control family (Switch + Checkbox + RadioGroup)

3 つの form control を一括追加。Input / Textarea / Label と組合せて完全な form 構築が DS のみで可能に。

#### Switch (Radix-based)

```tsx
<Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Notifications" />
```

- on/off 状態を data-state でアニメーション (translate-x で thumb 移動)
- checked 時 `bg-brand`・unchecked 時 `bg-neutral-200`
- focus ring + disabled state 完備

#### Checkbox (Radix-based)

```tsx
<label className="flex items-center gap-2">
  <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} />
  <span>利用規約に同意する</span>
</label>
```

- checked 時 `bg-brand` + `text-brand-fg` + `lucide-react Check` icon 表示
- aria-invalid 対応 (Input/Textarea と同パターン)

#### RadioGroup + RadioGroupItem (Radix-based)

```tsx
<RadioGroup defaultValue="standard">
  <label className="flex items-center gap-2">
    <RadioGroupItem value="standard" />
    <span>Standard</span>
  </label>
  <label className="flex items-center gap-2">
    <RadioGroupItem value="premium" />
    <span>Premium</span>
  </label>
</RadioGroup>
```

- 排他選択・キーボード矢印キーで選択切替 (Radix 標準)
- checked 時 `border-brand` + 内部 dot icon 表示

### Lockstep version bump
- `@willink-labs/tailwind-preset@0.5.0` (form controls 用 utilities + safelist)
- `@willink-labs/tokens@0.5.0` (code 変更なし・lockstep)


### Added — Tooltip + Toast component family

#### Tooltip (Radix-based)

```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@willink-labs/react";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>?</TooltipTrigger>
    <TooltipContent>Help text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

- Radix Tooltip primitives wrapped (Portal / position / arrow / a11y 全て継承)
- DS choice: `delayDuration` default 300ms (Radix 標準 700ms より snappy)
- Brand styling: `bg-neutral-900 text-neutral-50 rounded-md shadow-md`
- Animation: `animate-fade-in/out` (preset.css の汎用 fade)
- Exports: `Tooltip` / `TooltipTrigger` / `TooltipContent` / `TooltipPortal` / `TooltipProvider`

#### Toast (Sonner wrapper)

```tsx
import { Toaster, toast } from "@willink-labs/react";

// app root (e.g. layout.tsx)
<Toaster />

// anywhere
toast.success("Saved");
toast.error("Failed", { description: "Try again" });
toast.promise(savePromise, { loading: "Saving...", success: "Saved", error: "Failed" });
```

- [Sonner](https://sonner.emilkowal.ski/) ベース (shadcn/ui 2024 推奨後継・Radix Toast より簡素)
- Brand styling: bg-bg / text-fg / border-border / shadow-md / rounded-lg
- action / cancel button も brand に統合 (`bg-brand text-brand-fg`)
- `<Toaster />` を app 直下に 1 度配置すれば、コードの任意箇所から `toast()` 呼び出しで通知可能
- Exports: `Toaster` / `toast`

### Lockstep version bump
- `@willink-labs/tailwind-preset@0.5.0` (Tooltip / Toast 用 utilities + animate-fade-in/out)
- `@willink-labs/tokens@0.5.0` (code 変更なし・lockstep)


### Added — Dialog component (Radix-based)

新しい component family。Radix Dialog (focus trap / Escape close / portal /
scroll lock / a11y label) を base に、ブランドモーション (preset.css の
duration / ease 統一) と size variant を統合。

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
    <p>Body</p>
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
      <Button>OK</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Exports

- `Dialog` (= Radix Root)
- `DialogTrigger` / `DialogClose` / `DialogPortal` (= Radix passthrough)
- `DialogOverlay` (full-screen backdrop with fade animation)
- `DialogContent` (centered card with scale-in animation・size variant)
- `DialogHeader` / `DialogFooter` / `DialogTitle` / `DialogDescription` (compound)
- `dialogContentVariants` (cva)
- `type DialogContentProps`

#### `<DialogContent>` props

| Prop | 型 | 説明 |
|---|---|---|
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | width 制御。default `md` (max-w-md 28rem) |
| `closeButton` | `ReactNode \| false` | 右上 ✕ button を上書き or 非表示 |
| `portal` | `boolean` | (default true) Portal でレンダ |
| `overlay` | `boolean` | (default true) backdrop overlay 描画 |

#### a11y

- focus trap (Radix 標準)
- Escape で close
- 自動 `aria-labelledby` (DialogTitle と紐付け)
- 自動 `aria-describedby` (DialogDescription と紐付け)
- 右上 ✕ button は `aria-label="Close"` 付与済
- axe 違反 0 (テスト確認済)

### Lockstep version bump
- `@willink-labs/tailwind-preset@0.5.0` (Dialog animation utilities + safelist)
- `@willink-labs/tokens@0.5.0` (code 変更なし・lockstep)


### Changed
- **Lockstep version bump** with `@willink-labs/tailwind-preset@0.5.0` and
  `@willink-labs/tokens@0.5.0`. `@willink-labs/react` 自体に code 変更なし。
- 0.5.0 採用で fit-ai brand axis (`[data-brand="fitai"]`) が利用可能になる
  (preset.css 側で追加・consumer は HTML root 属性のみ変更で fit-ai brand
  に切替可能)。

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
  - Repository: `willink-oss/willink-design-system`
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

### Reference
- Postmortem of past 2 DS attempts (2024-01 / 2024-05): see
- Phase 1 implementation plan: `~/.claude/plans/cozy-painting-rabbit.md`
