import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  // RSC (Next.js App Router) consumers: the bundle executes client-only code at
  // module top level (createContext in FormField, hooks throughout), so the
  // dist itself must carry the 'use client' directive. esbuild strips
  // source-level directives during bundling (toast.tsx's own "use client" does
  // NOT survive into dist) — the banner is the canonical tsup escape hatch and
  // lands as the first line of every emitted JS file.
  // Regression-guarded by scripts/check-dist-use-client.mjs (runs post-build).
  banner: { js: "'use client';" },
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  // treeshake (tsup's extra rollup pass) MUST stay off: rollup 4 removes
  // module-level directives from the chunk (MODULE_LEVEL_DIRECTIVE), which
  // silently deletes the banner above. esbuild's bundler still tree-shakes;
  // measured cost of disabling the rollup pass is ~4.7 KB (40.4 → 45.1 KB).
  treeshake: false,
  external: [
    "react",
    "react-dom",
    "tailwindcss",
    "@willink-labs/tailwind-preset",
    "@willink-labs/tokens",
  ],
  outDir: "dist",
  target: "es2022",
});
