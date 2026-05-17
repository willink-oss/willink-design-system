import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "../src");

function readCss(name: string): string {
  return fs.readFileSync(path.join(srcDir, name), "utf8");
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
});
