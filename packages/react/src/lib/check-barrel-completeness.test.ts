/**
 * barrel completeness gate — packages/react/src/index.ts が src/components/ の
 * 出荷コンポーネントを 1:1 で re-export していることを構造的に保証する。
 *
 * 新コンポーネントを追加したが barrel (src/index.ts) への re-export を忘れて
 * 出荷する drift（型・値が public API に出てこない／逆に dir を消したのに
 * export が残る盲点）を防止する。index.ts は `// PRn:` コメント付きで手管理
 * されており drift しやすい。check-a11y-matrix.test.ts と同系の set-equality gate。
 *
 * 対応規則: components/<kebab>/ に <kebab>.tsx があれば「出荷コンポーネント」、
 * barrel 側は `from "./components/<kebab>"` specifier を数える（kebab 同士で比較）。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS_DIR = join(__dirname, "..", "components");
const INDEX = join(__dirname, "..", "index.ts");

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

// every `from "./components/<name>"` specifier the barrel re-exports. The name
// class matches anything readdir could return for a single path segment (not just
// kebab), so a non-kebab dir would surface as a real drift rather than silently
// failing to match — the gate stays purely about barrel completeness, not naming.
function barrelExports(ts: string): string[] {
  const names = new Set<string>();
  const re = /from\s+"\.\/components\/([^"/]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(ts))) names.add(m[1]);
  return [...names];
}

describe("check-barrel-completeness (src/index.ts ↔ src/components 1:1)", () => {
  it("every component dir is re-exported from the barrel and vice versa", () => {
    const dirs = componentDirs().sort();
    const exported = barrelExports(readFileSync(INDEX, "utf8")).sort();

    const missingExport = dirs.filter((d) => !exported.includes(d)); // dir w/o re-export
    const orphanExport = exported.filter((e) => !dirs.includes(e)); // re-export w/o dir

    if (missingExport.length || orphanExport.length) {
      console.error("\n  barrel drift detected:");
      if (missingExport.length)
        console.error(
          `    component dirs NOT re-exported from index.ts: ${missingExport.join(", ")}`,
        );
      if (orphanExport.length)
        console.error(
          `    index.ts re-exports with NO component dir: ${orphanExport.join(", ")}`,
        );
      console.error(
        '\n  Add `export { … } from "./components/<name>";` to packages/react/src/index.ts when shipping a component (and remove it when deleting one).',
      );
    }
    expect(missingExport).toEqual([]);
    expect(orphanExport).toEqual([]);
  });
});
