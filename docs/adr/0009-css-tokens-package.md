# ADR-0009: `@willink-labs/css-tokens` — framework-agnostic CSS variable export

- **Status**: Accepted
- **Date**: 2026-05-17
- **Phase**: 9 (v1.0.0 prep — DS reach beyond Tailwind v4)

## Context

DS adoption beyond the React stack has one structural blocker. The current distribution depends on Tailwind v4:

- `@willink-labs/tailwind-preset` ships `@theme` blocks, `@utility` rules, and `@source` directives that only Tailwind v4 understands.
- `@willink-labs/react` peer-depends on `tailwindcss@^4.0.0` because its component classes are cva strings that target Tailwind-emitted utilities.

Three consumer environments do not fit:

1. **Esperanza WP theme** (PHP / SCSS) — no JS toolchain, no Tailwind. ADR-0008 (DS scope) committed to a "stage 2" CSS-variable export package as the Esperanza integration vehicle.
2. **Future Astro / Vue / Svelte consumers** — these stacks can run Tailwind v4 but many teams prefer raw CSS variables for portability and to avoid a build-time framework lock-in.
3. **Documentation playgrounds / CDN consumers** — quick prototypes that want to drop a `<link rel="stylesheet">` into a static HTML page.

The current workaround for these consumers is "copy the hex values from `primitive.json` into your own SCSS" — fragile, drifts as soon as DS bumps primitives, and was the root cause of the ClubLink purple regression on the React side (semantic state tokens consumers had to alias manually). For Esperanza specifically, ADR-0008 documented a manual SCSS copy step as Stage 1 with an explicit migration to a dedicated package as Stage 2.

## Decision

**Ship `@willink-labs/css-tokens` as a sibling npm package that emits the DS token vocabulary as plain CSS custom properties.**

### Surface

```css
@import "@willink-labs/css-tokens/tokens.css";

:root {
  --color-brand: #2563eb;  /* override the same axis the Tailwind preset exposes */
}
```

Three importable entry points:

- `./tokens.css` — primitives + semantic (default)
- `./tokens.scale.css` — primitives only (numeric scales)
- `./tokens.semantic.css` — semantic only (consumer loads primitives separately)

### Source of truth

The package is **generated** from `@willink-labs/tokens` (DTCG JSON). `scripts/generate.mjs` walks `primitive.json` and `semantic.json`, flattens the tree into CSS custom-property declarations, and translates DTCG aliases (`"{color.brand.600}"`) into `var(--color-brand-600)`. The output is committed so consumers install without a build step.

### Alias semantics

`semantic.json` references like `"{color.brand}"` (group, no subscript) are not standard DTCG leaves. The generator adds a shorthand declaration `--color-brand: var(--color-brand-600);` after the primitive block, mirroring the convention already in use in `tailwind-preset/src/preset.css`. This keeps the override surface aligned across the two distribution paths.

### Versioning

Joins the monorepo at the current lockstep version (`0.13.0` at introduction). All four npm packages — `tokens` / `tailwind-preset` / `react` / `css-tokens` — bump together at every release. The Flutter package (`willink_theme`) continues to version independently (formalized in a future ADR).

## Rationale

### Why not just publish `tokens` JSON for consumers to consume?

`@willink-labs/tokens` already exposes DTCG JSON. A WordPress / Astro / Vue consumer could in principle consume that, but:

- They would need their own DTCG → CSS converter. Every consumer reinvents the same script.
- DTCG alias resolution is non-trivial (`{color.brand}` group references, recursive aliases). A consumer-side converter would diverge from the DS canonical resolver and tokens/semantic might drift in ways no single test would catch.
- Esperanza specifically runs PHP, not JS — there is no way for them to run a Node generator at build time without adding a JS toolchain.

A pre-built CSS asset is what these consumers actually want.

### Why not derive the OKLCH brand scale here too?

The Tailwind preset computes `--color-brand-50` … `--color-brand-950` at render time via `color-mix(in oklch, var(--color-brand), …)`. This works because Tailwind v4's `@theme` cascade evaluates the variables lazily.

If the css-tokens package emitted the same `color-mix(…)` expressions, consumer overrides of `--color-brand` would propagate through the numeric scale too — at first glance the best of both worlds.

The trade-off rejects it:
- `color-mix()` is **CSS Color Module Level 5**, supported in Chrome 111+ / Firefox 113+ / Safari 16.4+. WordPress theme consumers in conservative IT environments are still expected to support older browsers; the i-willink baseline hex values are universally supported.
- The OKLCH-derived scale's hue calibration was tuned for the i-willink violet baseline. A consumer overriding `--color-brand` to a different hue would get a numerically derived scale that may not match what their designer hand-picked — for an Esperanza-scale theme this is more risk than benefit.

Decision: emit static hex values for the numeric scale. Document the difference loudly in the README — adopters who want full brand-axis derivation use the Tailwind preset.

### Why lockstep versioning from day one?

The package joins at `0.13.0` rather than `0.1.0`. Three reasons:
- The release process is already lockstep (single PR bumps all packages; one git tag triggers publish.yml to publish them together). Adding a fifth-wheel version line would break that contract.
- For consumer migration guides, `tokens 0.13.0 / tailwind-preset 0.13.0 / react 0.13.0 / css-tokens 0.13.0` is a single mental model. Diverging at `0.1.0` invites "what version pairs together?" questions.
- The v1.0.0 release cut (Phase 9.6) will bump all four npm packages to `1.0.0` in one commit. Starting at `0.13.0` means the css-tokens version line is identical to the others at the cut.

## Consequences

### Positive
- Esperanza WP unblocked — single `@import` line replaces the manual SCSS copy from ADR-0008 stage 1.
- Future Astro / Vue / Svelte adopters get a first-class export.
- Same `:root { --color-brand: … }` override pattern across both Tailwind and plain-CSS paths.
- DS contract surfaces in one more environment, reducing the cost of "DS adoption" for a new prospect.

### Negative
- Numeric brand scale is static — consumer-side hue overrides do **not** propagate into `--color-brand-{50..950}`. Documented loudly; the workaround is the Tailwind preset.
- One more package in the publish.yml workflow. Mitigation: trivial step (single `pnpm publish` line).
- Generator script is the single point of divergence risk. Mitigation: generated files are committed, so the divergence is visible in PR diff at every token change.

### Neutral
- The package has no `build` step in the consumer's project — the generated CSS is shipped as-is.
- The package adds zero runtime cost (CSS only, no JS).

## Related

- ADR-0008 — DS scope decision; this package implements stage 2 for the Esperanza integration
- `packages/css-tokens/README.md` — usage doc
- `packages/css-tokens/scripts/generate.mjs` — the resolver
- `docs/roadmap/v1.0.md` — Phase Bonus listed alongside Phase 9.x
