/**
 * test presence gate — すべての出荷コンポーネントに colocated な <name>.test.tsx
 * が存在することを保証する。
 *
 * check-axe-coverage (#131) は test の「中身」(jest-axe assertion) を検査するが、
 * 本 gate は test file の「存在」そのものを guard する。component をテストごと
 * 落として出荷する drift を構造的に塞ぐ。check-story / barrel-completeness と
 * 同系の set-inclusion gate。
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS_DIR = join(__dirname, "..", "components");

// src/components/<name>/ that ships a component (has the <name>.tsx source).
function componentDirs(): string[] {
  return readdirSync(COMPONENTS_DIR).filter((entry) => {
    const full = join(COMPONENTS_DIR, entry);
    return (
      statSync(full).isDirectory() &&
      readdirSync(full).includes(`${entry}.tsx`)
    );
  });
}

describe("check-test-presence (every component dir has <name>.test.tsx)", () => {
  it("every src/components/<name>/ ships a colocated <name>.test.tsx", () => {
    const missing = componentDirs()
      .filter(
        (name) => !existsSync(join(COMPONENTS_DIR, name, `${name}.test.tsx`)),
      )
      .sort();

    if (missing.length) {
      console.error("\n  component dir missing its test file:");
      for (const m of missing)
        console.error(
          `    ${m} → packages/react/src/components/${m}/${m}.test.tsx`,
        );
      console.error(
        "\n  Every component ships a colocated <name>.test.tsx (render + roles + jest-axe).",
      );
    }
    expect(missing).toEqual([]);
  });
});
