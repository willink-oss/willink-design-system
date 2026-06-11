import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "../src");
const semanticJsonPath = path.resolve(__dirname, "../../tokens/src/semantic.json");

function readCss(name: string): string {
  return fs.readFileSync(path.join(srcDir, name), "utf8");
}

/** Count semantic.json leaves carrying a `$extensions["willink.dark"]` entry. */
function countDarkExtensions(node: unknown): number {
  if (typeof node !== "object" || node === null) return 0;
  const obj = node as Record<string, unknown>;
  let count = 0;
  if ("$value" in obj && "$type" in obj) {
    const ext = obj.$extensions as Record<string, unknown> | undefined;
    return ext && "willink.dark" in ext ? 1 : 0;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    count += countDarkExtensions(value);
  }
  return count;
}

describe("@willink-labs/css-tokens generated files", () => {
  it("tokens.css contains primitive color scale + semantic + motion roles + brand shorthand", () => {
    const css = readCss("tokens.css");
    expect(css).toContain("--color-brand-600: #7c3aed");
    expect(css).toContain("--color-brand: var(--color-brand-600)");
    expect(css).toContain("--color-bg: #ffffff");
    expect(css).toContain("--motion-modal-enter: var(--duration-fast)");
    expect(css).toContain("--ease-enter: var(--ease-standard)");
  });

  it("tokens.scale.css emits primitives only (no semantic / motion)", () => {
    const css = readCss("tokens.scale.css");
    expect(css).toContain("--color-brand-600");
    expect(css).toContain("--duration-fast");
    expect(css).not.toContain("--motion-modal-enter");
    expect(css).not.toContain("--color-bg:");
  });

  it("tokens.semantic.css emits semantic + motion roles only", () => {
    const css = readCss("tokens.semantic.css");
    expect(css).toContain("--color-bg: #ffffff");
    expect(css).toContain("--motion-modal-enter: var(--duration-fast)");
    expect(css).not.toMatch(/--color-brand-500: #/);
  });

  it("DTCG alias references are emitted as var(--…), not resolved hex", () => {
    const css = readCss("tokens.css");
    // `ring` in semantic.json aliases `{color.brand}` → should be `var(--color-brand)`
    expect(css).toContain("--color-ring: var(--color-brand)");
    // `brand` slot aliases `{color.brand.600}` → should be `var(--color-brand-600)`
    expect(css).toMatch(/--color-brand: var\(--color-brand-600\)/);
  });

  it("tokens.dark.css exists after generate and carries both dark selectors (ADR-0013)", () => {
    expect(fs.existsSync(path.join(srcDir, "tokens.dark.css"))).toBe(true);
    const css = readCss("tokens.dark.css");
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).toContain(':root:not([data-theme="light"])');
  });

  it("tokens.dark.css var count matches the willink.dark $extensions in semantic.json", () => {
    const semantic = JSON.parse(fs.readFileSync(semanticJsonPath, "utf8"));
    const expected = countDarkExtensions(semantic);
    expect(expected).toBeGreaterThan(0);
    const css = readCss("tokens.dark.css");
    // every extension is emitted twice — once per activation path
    // (media-query block + data-theme block)
    const decls = css.match(/^\s*--[a-z0-9-]+:/gm) ?? [];
    expect(decls.length).toBe(expected * 2);
  });

  it("tokens.dark.css flips semantic roles via var() and omits invariant roles", () => {
    const css = readCss("tokens.dark.css");
    expect(css).toContain("--color-bg: var(--color-neutral-950)");
    expect(css).toContain("--color-brand-soft: var(--color-brand-950)");
    // invariant roles (no willink.dark extension) must not appear
    expect(css).not.toContain("--color-ring");
    expect(css).not.toContain("--color-brand-fg");
    expect(css).not.toContain("--color-accent-cyan");
  });
});
