# `@willink-labs/tokens`

i-Willink Design System design tokens (DTCG-compatible JSON). Single source of truth for all primitive, semantic, and brand-axis tokens consumed by `@willink-labs/tailwind-preset`, `@willink-labs/react`, and `willink_theme` (pub.dev).

## Install

```bash
pnpm add @willink-labs/tokens
```

## Exports

| Subpath | Contents |
|---|---|
| `.` | TypeScript re-exports of all token JSON |
| `./primitive.json` | Primitive token values (raw color shades, type scale, spacing, etc.) |
| `./semantic.json` | Semantic mappings (`brand`, `fg`, `bg`, `border`, etc.) |
| `./brand/willink.json` | Willink brand axis overrides |
| `./brand/clublink.json` | Clublink brand axis overrides |
| `./brand/fitai.json` | fit-ai brand axis overrides |

## Usage

Most consumers should not import this package directly. Use `@willink-labs/tailwind-preset` (React/Next.js apps) or `willink_theme` on pub.dev (Flutter apps) which read from this package internally.

Direct usage is appropriate for build-time tooling (e.g. generating CSS variables for non-Tailwind consumers).

## License

MIT License — see [LICENSE](../../LICENSE) for details.
