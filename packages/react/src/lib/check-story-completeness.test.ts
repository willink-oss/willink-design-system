/**
 * story completeness gate — すべての出荷コンポーネントに Storybook story が
 * 存在することを保証する。Storybook は DS の公開カタログなので、story を落とした
 * まま component を出荷する drift（誰も CI で気づけない盲点）を防止する。
 *
 * 方向は A ⊆ B（component dir → story）のみ。component を持たない overview /
 * intro 等の doc story（将来追加され得る）は許容し、orphan story は guard しない。
 * check-a11y-matrix / check-barrel-completeness と同系の set-inclusion gate。
 *
 * 対応規則: components/<kebab>/ に <kebab>.tsx があれば「出荷コンポーネント」、
 * story は apps/storybook/src/stories/<kebab>.stories.tsx（kebab 同士で比較）。
 */
import { readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS_DIR = join(__dirname, "..", "components");
// src/lib → src → react → packages → repo root → apps/storybook/src/stories
const STORIES_DIR = join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "apps",
  "storybook",
  "src",
  "stories",
);

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

// every <name>.stories.tsx basename in the storybook stories dir.
function storyNames(): Set<string> {
  const names = new Set<string>();
  for (const entry of readdirSync(STORIES_DIR)) {
    const m = entry.match(/^(.+)\.stories\.tsx$/);
    if (m) names.add(m[1]);
  }
  return names;
}

describe("check-story-completeness (every component has a Storybook story)", () => {
  it("every src/components/<name>/ has apps/storybook/src/stories/<name>.stories.tsx", () => {
    const stories = storyNames();
    const missing = componentDirs()
      .filter((d) => !stories.has(d))
      .sort();

    if (missing.length) {
      console.error("\n  Storybook story missing for shipped component(s):");
      for (const m of missing)
        console.error(`    ${m} → apps/storybook/src/stories/${m}.stories.tsx`);
      console.error(
        "\n  Storybook is the public catalog — add a CSF3 story when shipping a component.",
      );
    }
    expect(missing).toEqual([]);
  });
});
