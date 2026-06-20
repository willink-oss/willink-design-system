/**
 * axe coverage gate — すべての出荷コンポーネントの test が実際に jest-axe の
 * assertion を含むことを保証する。a11y は DS の中核約束であり、各 component cycle
 * は慣習として axe test を入れているが、それを強制する gate は無かった。
 *
 * check-a11y-matrix (#117) は matrix の「行」を保証するが、axe test が実際に走る
 * ことは保証しない。<name>.test.tsx が axe() を呼ばずに（あるいはコメントアウト
 * したまま）出荷される盲点を構造的に塞ぐ。check-story / barrel-completeness と
 * 同系の gate。
 *
 * 判定: comment 除去後の <name>.test.tsx が `axe(` 呼び出し と `toHaveNoViolations`
 * の両方を含むこと。両シグナルを要求するので、import 行のみ・コメントアウト済み
 * といった「形だけ」の test は通さない（assertion は file 内のどこにあってもよい。
 * toast 等は `const r = await axe(...)` と `expect(r).toHaveNoViolations()` を別行に
 * 分けるため、行単位ではなく file 単位で両シグナルを見る）。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS_DIR = join(__dirname, "..", "components");

// block (`/* … */`・JSDoc) と line (`// …`) コメントを除去。コメントアウトされた
// axe assertion を「カバー済み」と誤判定しないため。`://`（URL）は保護する。
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

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

describe("check-axe-coverage (every component test asserts jest-axe)", () => {
  it("every component's <name>.test.tsx contains a real axe() + toHaveNoViolations assertion", () => {
    const offenders: string[] = [];
    for (const name of componentDirs().sort()) {
      const testFile = join(COMPONENTS_DIR, name, `${name}.test.tsx`);
      if (!existsSync(testFile)) {
        offenders.push(`${name}: no ${name}.test.tsx`);
        continue;
      }
      const src = stripComments(readFileSync(testFile, "utf8"));
      const hasAxeCall = /\baxe\s*\(/.test(src);
      const hasAssertion = /toHaveNoViolations/.test(src);
      if (!hasAxeCall || !hasAssertion) {
        const missing = [
          hasAxeCall ? null : "axe(...) call",
          hasAssertion ? null : "toHaveNoViolations",
        ]
          .filter(Boolean)
          .join(" + ");
        offenders.push(`${name}: missing ${missing}`);
      }
    }
    if (offenders.length) {
      console.error("\n  component test missing a jest-axe assertion:");
      for (const o of offenders) console.error(`    ${o}`);
      console.error(
        "\n  Every component ships a jest-axe test — e.g.:\n" +
          "    const { container } = render(<…/>);\n" +
          "    expect(await axe(container)).toHaveNoViolations();",
      );
    }
    expect(offenders).toEqual([]);
  });
});
