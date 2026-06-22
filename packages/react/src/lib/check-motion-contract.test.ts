/**
 * ADR-0008 Layer 1 motion contract の regression gate。
 *
 * `animate-(fade|dialog|sheet|accordion|pulse)` を使うコンポーネントは、必ず
 * `motion-reduce:animate-none` を併記して `prefers-reduced-motion` で動きを
 * 止めなければならない (Layer-1 の可読契約)。`transition-none` は CSS transition
 * しか止めず animation を止めないため、`animate-*` には `animate-none` が必須。
 *
 * DropdownMenu / Select がこの Layer-1 を欠いたまま出荷された再発 (issue #78) を
 * 構造的に防止する静的ゲート。check-tokens.test.ts と同じ walk() で components/
 * 配下の `.tsx` を走査する (コメントは除去して例示が false-positive にならないように)。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS_DIR = join(__dirname, "..", "components");

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") continue;
      yield* walk(full);
    } else if (entry.endsWith(".tsx") && !entry.endsWith(".test.tsx")) {
      yield full;
    }
  }
}

// block + line コメントを除去 (コメント内の例示で誤検知しないため)
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

const ANIMATE = /animate-(fade|dialog|sheet|accordion|pulse)/;
const MOTION_REDUCE = /motion-reduce:animate-none/;

describe("check-motion-contract (ADR-0008 Layer 1)", () => {
  it("every animated component declares motion-reduce:animate-none", () => {
    const violations: string[] = [];
    for (const file of walk(COMPONENTS_DIR)) {
      const content = stripComments(readFileSync(file, "utf8"));
      if (ANIMATE.test(content) && !MOTION_REDUCE.test(content)) {
        violations.push(file.replace(COMPONENTS_DIR, ""));
      }
    }
    if (violations.length > 0) {
      console.error("\n  ADR-0008 Layer 1 違反 (motion-reduce 欠落):");
      for (const v of violations) console.error(`    ${v}`);
      console.error(
        "\n  animate-* を使うコンポーネントは motion-reduce:animate-none を併記してください。",
      );
    }
    expect(violations).toEqual([]);
  });
});
