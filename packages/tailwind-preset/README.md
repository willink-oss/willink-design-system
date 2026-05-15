# `@willink-labs/tailwind-preset`

Tailwind v4 preset for the i-Willink Design System. Imports `@willink-labs/tokens` via `@theme` and provides brand-axis switching via `[data-brand="willink|clublink|fitai"]` selectors.

## Install

```bash
pnpm add @willink-labs/tailwind-preset @willink-labs/tokens
```

Requires Tailwind v4.

## Usage

```css
/* app/globals.css */
@import "@willink-labs/tailwind-preset/preset.css";
```

That's it. `preset.css` auto-imports `safelist.css`, which uses Tailwind v4's `@source inline()` directive to register every DS component class — no manual `@source` paths required.

Switch the brand axis in markup:

```html
<html data-brand="clublink">
  <!-- DS components will use the clublink axis -->
</html>
```

## Exports

| Subpath | Contents |
|---|---|
| `.` | TypeScript helper (`BRANDS` array, etc.) |
| `./preset.css` | Main preset (`@theme` + brand `[data-brand=...]` blocks). Auto-imports `./safelist.css`. |
| `./safelist.css` | `@source inline()` registrations for DS component class strings |
| `./brands/willink.css` | Force-mode brand override (for environments without `data-brand` attr) |
| `./brands/clublink.css` | Force-mode brand override |
| `./brands/fitai.css` | Force-mode brand override |

## Semantic tokens (whitelist)

Use these. shadcn-default names (`bg-primary` / `text-foreground` / etc.) are explicitly forbidden — see `packages/react/src/lib/check-tokens.test.ts`.

| Class | Purpose |
|---|---|
| `bg-brand` / `bg-brand-hover` / `bg-brand-active` | Brand surfaces |
| `text-fg` / `text-fg-muted` / `text-fg-subtle` | Foreground text |
| `text-brand-fg` | Foreground on brand surface |
| `border-border` / `border-border-strong` | Borders |
| `ring-ring` | Focus ring |
| `bg-success` / `bg-warning` / `bg-danger` (+ `text-*` variants) | Feedback |

## License

MIT License — see [LICENSE](../../LICENSE) for details.
