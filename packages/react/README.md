# @willink-labs/react

i-Willink Design System の React コンポーネントライブラリ。
shadcn/ui 風の API + Radix UI primitive 個別採用 + Tailwind v4 semantic token 駆動。

> **対象**: Next.js / React アプリ全般。WordPress テーマは consumer ではない (token のみ参照)。

---

## Installation

```bash
pnpm add @willink-labs/react @willink-labs/tailwind-preset @willink-labs/tokens
```

`apps/<your-app>/postcss.config.mjs` に Tailwind v4 PostCSS plugin、`globals.css` に preset を import:

```css
@import "@willink-labs/tailwind-preset/preset.css";
```

ブランド軸を切替えたい場合は `<html data-brand="clublink">` (または `"fitai"`) を設定。デフォルトは `willink`。

### Next.js App Router (RSC)

dist は先頭に `'use client'` directive を同梱する (1.4.1+)。全 component は Client Component として動作し、Server Component から直接 import できる — client 側 re-export shim は不要 (1.4.0 以前で必要だった workaround は削除してよい)。

---

## Components (1.4.0・25 total)

### Phase 0-3 core set (7・0.1.0-0.4.x)

| Component | Variants | Sizes | Headless |
|---|---|---|---|
| `Button` | default / outline / ghost / link | sm / md / lg | Radix Slot (asChild) |
| `Badge` | default / outline / success / warning / danger | — | — |
| `Input` | — (`aria-invalid` で error border + focus ring) | — | native |
| `Textarea` | — | — | native |
| `Label` | — | sm / md (`required` で `*` 表示) | Radix Label |
| `Card` | default / elevated | — | compound: Header / Title / Description / Content / Footer |
| `Accordion` | single / multiple + AccordionItem variant (flat / card / bordered・0.5.0+) | — | Radix Accordion |

### Phase 7+ expansion (14・0.5.0)

| Component | API / Notes | Headless |
|---|---|---|
| `Dialog` | size variants (sm / md / lg / 2xl) + brand-tinted overlay + DS fade/scale motion | Radix Dialog |
| `AlertDialog` | destructive confirmation pattern + Action / Cancel buttons | Radix AlertDialog |
| `Avatar` | size sm / md / lg / xl + AvatarImage / AvatarFallback compound | Radix Avatar |
| `Tabs` | data-brand aware indicator + animated active state | Radix Tabs |
| `Tooltip` | TooltipProvider + delayed-open fade animation | Radix Tooltip |
| `Toast` | Sonner wrapper with brand-tinted variants (success / error / info) | Sonner |
| `DropdownMenu` | Item / Label / Separator / CheckboxItem with popover-style positioning | Radix DropdownMenu |
| `Select` | trigger / content / item + brand focus ring | Radix Select |
| `Switch` | data-state translation animation + brand fill on check | Radix Switch |
| `Checkbox` | indicator content alignment + brand-fg check icon | Radix Checkbox |
| `RadioGroup` | flat / horizontal layout + brand fill on check | Radix RadioGroup |
| `Slider` | brand range + neutral track + disabled state | Radix Slider |
| `Progress` | brand-filled indicator + animated transitions | Radix Progress |
| `Separator` | horizontal / vertical orientation | Radix Separator |

### 0.7.x / v1.4 additions (4)

| Component | API / Notes | Headless |
|---|---|---|
| `Skeleton` | rect / circle / text variants + animate-pulse | — |
| `Sheet` | top / right (default) / bottom / left side variants | Radix Dialog |
| `Toggle` | default / outline × sm / md / lg + controlled/uncontrolled | Radix Toggle |
| `FormField` | compound a11y wiring (Label / Control / Description / Error)・`id` / `htmlFor` / `aria-describedby` / `aria-invalid` 自動配線 ([ADR-0015](../../docs/adr/0015-formfield-api.md)) | Radix Slot |

---

## Usage

```tsx
import { Button, Badge, Input, Label, Textarea } from "@willink-labs/react";

export function ContactForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} />
      </div>

      <Button type="submit">送信する</Button>
      <Badge variant="outline">Optional</Badge>
    </form>
  );
}
```

### Button asChild — Next.js Link との合成

```tsx
import Link from "next/link";

<Button asChild>
  <Link href="/dashboard">ダッシュボードへ</Link>
</Button>;
```

### FormField — a11y 配線の compound (1.4.0+)

1.3.0 まで README が案内していた「自前 FormField wrapper」パターンは不要になった。
`FormField` compound が `id` / `htmlFor` / `aria-describedby` / `aria-invalid` を自動配線する
([ADR-0015](../../docs/adr/0015-formfield-api.md)):

```tsx
import {
  FormField,
  FormFieldControl,
  FormFieldDescription,
  FormFieldError,
  FormFieldLabel,
  Input,
} from "@willink-labs/react";

<FormField>
  <FormFieldLabel required>Email</FormFieldLabel>
  <FormFieldControl>
    <Input type="email" />
  </FormFieldControl>
  <FormFieldDescription>会社のメールアドレスを入力してください。</FormFieldDescription>
  <FormFieldError>{errors.email}</FormFieldError>
</FormField>;
```

- id は `useId()` で自動生成 — list 描画でも衝突しない。手書き id 不要。
- `FormFieldControl` は Radix Slot: `Input` / `Textarea` / native 要素 / Radix trigger を
  1 つだけ子に取り、`id` + `aria-describedby` (+ error 時 `aria-invalid`) を注入する。
- `FormFieldError` は内容があるときだけ `role="alert"` 付きで描画される —
  `{errors.email}` をそのまま渡して常時マウントしてよい。error が描画されると
  control の `aria-invalid` も自動で立ち、Input / Textarea の border / focus ring が
  danger 色に切替わる。
- 制約: `FormFieldDescription` / `FormFieldError` は `FormField` の**直下**に置くこと
  (描画有無の検査が直接の子要素に対して行われるため)。

---

## Design tokens

DS が emit する semantic token を **そのまま Tailwind class として使う**:

| Class | 用途 |
|---|---|
| `bg-brand` / `text-brand-fg` | primary action |
| `bg-bg` / `text-fg` | ページ背景 / 本文 |
| `text-muted` | 補助テキスト |
| `border-border` | 区切り線・枠 |
| `ring-ring` | focus ring |
| `text-success` / `text-warning` / `text-danger` | feedback |

shadcn 標準命名 (`bg-primary` / `text-foreground` 等) は **使用禁止**。
`packages/react/src/lib/check-tokens.test.ts` で grep ベースに検出される。

---

## Build / Test

```bash
pnpm -F @willink-labs/react build       # tsup ESM + dts
pnpm -F @willink-labs/react test        # vitest + @testing-library + axe
```

---

## License

MIT License — see [LICENSE](../../LICENSE) for details.
