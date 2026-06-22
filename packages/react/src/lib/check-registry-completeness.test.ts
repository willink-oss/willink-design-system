/**
 * registry completeness gate — apps/registry の block dir と registry.json の
 * registry:block items が 1:1 で対応していることを構造的に保証する。
 *
 * shadcn build は registry.json に登録された block だけを /r/ に出荷し、未登録の
 * block dir は黙って無視する。そのため「block dir を足したが registry.json への
 * 登録を忘れた」silent orphan（= /r/<name>.json が出荷されない盲点）も、逆に
 * 「registry.json に名前が残るが dir を消した」drift も CI では気づけない
 * （CI の shadcn build は registry.json が参照する files[].path 欠落しか見ない）。
 * check-barrel-completeness と同形の双方向 set-equality gate でこれを塞ぐ。
 *
 * 対応規則: apps/registry/registry/blocks/<name>/ に <name>.tsx があれば
 * 「出荷 block」、registry.json 側は items[type=registry:block].name を数える
 * （name 同士で比較）。registry:lib（cn 等）は block ではないので対象外。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// src/lib → src → react → packages → repo root → apps/registry
const REGISTRY_DIR = join(__dirname, "..", "..", "..", "..", "apps", "registry");
const BLOCKS_DIR = join(REGISTRY_DIR, "registry", "blocks");
const REGISTRY_JSON = join(REGISTRY_DIR, "registry.json");

// apps/registry/registry/blocks/<name>/ that ships a block (has <name>.tsx).
function blockDirs(): string[] {
  return readdirSync(BLOCKS_DIR).filter((entry) => {
    const full = join(BLOCKS_DIR, entry);
    return (
      statSync(full).isDirectory() &&
      readdirSync(full).includes(`${entry}.tsx`)
    );
  });
}

// every items[].name whose type is "registry:block" in registry.json.
function registeredBlocks(): string[] {
  const json = JSON.parse(readFileSync(REGISTRY_JSON, "utf8")) as {
    items?: { name: string; type: string }[];
  };
  return (json.items ?? [])
    .filter((item) => item.type === "registry:block")
    .map((item) => item.name);
}

describe("check-registry-completeness (apps/registry blocks ↔ registry.json 1:1)", () => {
  it("every block dir is registered in registry.json and vice versa", () => {
    const dirs = blockDirs().sort();
    const registered = registeredBlocks().sort();

    // dir w/o registry entry = silent orphan: shadcn build ignores it, never shipped to /r/
    const missingEntry = dirs.filter((d) => !registered.includes(d));
    // registry entry w/o dir = dangling name (the build error is files[].path, this names it)
    const orphanEntry = registered.filter((r) => !dirs.includes(r));

    if (missingEntry.length || orphanEntry.length) {
      console.error("\n  registry drift detected:");
      if (missingEntry.length)
        console.error(
          `    block dirs NOT registered in registry.json (orphan, never shipped to /r/): ${missingEntry.join(", ")}`,
        );
      if (orphanEntry.length)
        console.error(
          `    registry.json registry:block entries with NO block dir: ${orphanEntry.join(", ")}`,
        );
      console.error(
        '\n  When adding a registry/blocks/<name>/ dir, also add the item to apps/registry/registry.json items[] (type: "registry:block") — and remove it when deleting the dir.',
      );
    }
    expect(missingEntry).toEqual([]);
    expect(orphanEntry).toEqual([]);
  });
});
