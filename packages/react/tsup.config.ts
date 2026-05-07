import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
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
