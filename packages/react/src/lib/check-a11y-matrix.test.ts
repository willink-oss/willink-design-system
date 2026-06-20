/**
 * a11y matrix coverage gate — docs/a11y/matrix.md の React テーブルが
 * src/components/ の出荷コンポーネントと 1:1 で一致することを構造的に保証する。
 *
 * 新コンポーネントが barrel + safelist + jest-axe を満たしつつ a11y-matrix 行を
 * 落として出荷する doc-drift（誰も CI で気づけない盲点）を防止する。
 * check-tokens.test.ts / check-motion-contract.test.ts と同系の静的ゲート。
 *
 * 対応規則: kebab-case のディレクトリ名 → PascalCase のコンポーネント名
 * (dropdown-menu → DropdownMenu, scroll-area → ScrollArea, kbd → Kbd)。
 * matrix の行名は最初のセルのバッククォート内 (| `Toast` (Sonner) | → "Toast")。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS_DIR = join(__dirname, "..", "components");
const MATRIX = join(__dirname, "..", "..", "..", "..", "docs", "a11y", "matrix.md");

// kebab-case dir -> PascalCase component name
function toPascal(kebab: string): string {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

// each src/components/<name>/ that ships a component (has the <name>.tsx source —
// true for every real component AND it catches a stray dir that adds a component
// file but forgets the matrix row, which is exactly the drift this gate guards).
function componentNames(): string[] {
  return readdirSync(COMPONENTS_DIR)
    .filter((entry) => {
      const full = join(COMPONENTS_DIR, entry);
      return (
        statSync(full).isDirectory() &&
        readdirSync(full).includes(`${entry}.tsx`)
      );
    })
    .map(toPascal);
}

// the React table of matrix.md (rows BETWEEN "## React components" and the
// "## Flutter components" boundary, so the 9 Flutter Willink* rows are excluded).
// each data row's first cell is a backtick-wrapped name: | `Name` | … |
function reactMatrixNames(md: string): string[] {
  const start = md.indexOf("## React components");
  const end = md.indexOf("## Flutter components");
  const section = md.slice(start, end === -1 ? undefined : end);
  const names: string[] = [];
  for (const line of section.split("\n")) {
    const m = line.match(/^\|\s*`([A-Za-z][A-Za-z0-9]*)`/);
    if (m) names.push(m[1]);
  }
  return names;
}

describe("check-a11y-matrix (docs/a11y/matrix.md ↔ src/components 1:1)", () => {
  it("every React component has a matrix row and every matrix row has a component", () => {
    const dirs = componentNames().sort();
    const rows = reactMatrixNames(readFileSync(MATRIX, "utf8")).sort();

    const missingRow = dirs.filter((d) => !rows.includes(d)); // component dir w/o matrix row
    const orphanRow = rows.filter((r) => !dirs.includes(r)); // matrix row w/o component dir

    if (missingRow.length || orphanRow.length) {
      console.error("\n  a11y matrix drift detected:");
      if (missingRow.length)
        console.error(
          `    components MISSING a matrix row: ${missingRow.join(", ")}`,
        );
      if (orphanRow.length)
        console.error(
          `    matrix rows with NO component dir: ${orphanRow.join(", ")}`,
        );
      console.error(
        "\n  Add the missing docs/a11y/matrix.md row (and bump the heading count) when shipping a component.",
      );
    }
    expect(missingRow).toEqual([]);
    expect(orphanRow).toEqual([]);
  });
});
