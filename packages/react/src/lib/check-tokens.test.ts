/**
 * shadcn/ui の標準命名 (`bg-primary` / `text-primary` / `text-foreground` 等) が
 * 新 DS の React 実装に紛れ込まないようにする regression test。
 *
 * 新 DS は semantic token として `bg-brand` / `text-brand-fg` / `border-border` /
 * `text-muted` / `bg-bg` / `text-fg` を使う。shadcn の `bg-primary` は **使わない**。
 *
 * 過去 DS 失敗パターン「技術スタック軸の不安定」(=shadcn 流儀をコピペすると
 * semantic 整合性が崩れる) を構造的に防止する gate。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const FORBIDDEN: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bbg-primary\b/, label: "bg-primary" },
  { pattern: /\btext-primary(?!-)/, label: "text-primary" },
  { pattern: /\bbg-secondary\b/, label: "bg-secondary" },
  { pattern: /\btext-secondary(?!-)/, label: "text-secondary" },
  { pattern: /\bbg-foreground\b/, label: "bg-foreground" },
  { pattern: /\btext-foreground\b/, label: "text-foreground" },
  { pattern: /\bbg-background\b/, label: "bg-background" },
  { pattern: /\bbg-accent\b/, label: "bg-accent" },
  { pattern: /\bbg-card\b/, label: "bg-card" },
  { pattern: /\btext-card-foreground\b/, label: "text-card-foreground" },
  { pattern: /\btext-primary-foreground\b/, label: "text-primary-foreground" },
  // dark mode (ADR-0013): primitive neutral utilities は dark で反転しないため、
  // semantic surface role (bg-surface-subtle / bg-surface-muted / bg-track /
  // bg-surface-inverted + text-surface-inverted-fg) のみ使用。
  // prefix 付き (hover:/focus:/data-[...]:) も部分一致で検知する。
  {
    pattern: /\bbg-neutral-\d+\b/,
    label: "bg-neutral-* (use bg-surface-subtle / bg-surface-muted / bg-track / bg-surface-inverted)",
  },
  {
    pattern: /\btext-neutral-\d+\b/,
    label: "text-neutral-* (use text-surface-inverted-fg / text-muted / text-fg)",
  },
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC_DIR = join(__dirname, "..");

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") continue;
      yield* walk(full);
    } else if (
      /\.(ts|tsx)$/.test(entry) &&
      !entry.endsWith(".test.ts") &&
      !entry.endsWith(".test.tsx")
    ) {
      yield full;
    }
  }
}

describe("check-tokens (shadcn 命名混入検知)", () => {
  it("no source file uses shadcn standard tokens (bg-primary / text-foreground / etc.)", () => {
    const violations: string[] = [];
    for (const file of walk(SRC_DIR)) {
      const content = readFileSync(file, "utf8");
      for (const { pattern, label } of FORBIDDEN) {
        if (pattern.test(content)) {
          violations.push(`${file.replace(SRC_DIR, "")}: ${label}`);
        }
      }
    }
    if (violations.length > 0) {
      console.error("\n  shadcn 命名混入を検知:");
      for (const v of violations) console.error(`    ${v}`);
      console.error(
        "\n  DS は semantic token (bg-brand / text-brand-fg / border-border / text-muted) のみ使用。",
      );
    }
    expect(violations).toEqual([]);
  });
});
