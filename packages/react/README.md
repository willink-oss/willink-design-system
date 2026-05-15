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

---

## Components (0.5.0・21 total)

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

### FormField composition pattern (推奨)

FormField wrapper component は DS では提供しないが、以下のパターンで誤用を防ぐ:

```tsx
function FormField({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

// 使用側:
<FormField id="email" label="Email" required error={errors.email}>
  <Input
    id="email"
    type="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? "email-error" : undefined}
  />
</FormField>;
```

`aria-invalid` を Input に渡すだけで Input 側の border / focus ring が danger 色に切替わる。

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
