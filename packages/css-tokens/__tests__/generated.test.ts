import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const srcDir = path.resolve(__dirname, "../src");
const primitiveJsonPath = path.resolve(__dirname, "../../tokens/src/primitive.json");
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

  it("emits the text emphasis ladder (1.5.0+ / ADR-0016) in light, mapped to neutral steps", () => {
    const css = readCss("tokens.css");
    expect(css).toContain("--color-fg-strong: var(--color-neutral-800)");
    expect(css).toContain("--color-fg-emphasis: var(--color-neutral-700)");
    expect(css).toContain("--color-fg-secondary: var(--color-neutral-600)");
    expect(css).toContain("--color-fg-subtle: var(--color-neutral-400)");
    expect(css).toContain("--color-fg-faint: var(--color-neutral-300)");
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

  it("tokens.dark.css var count matches the willink.dark $extensions in semantic.json + primitive.json", () => {
    const semantic = JSON.parse(fs.readFileSync(semanticJsonPath, "utf8"));
    const primitive = JSON.parse(fs.readFileSync(primitiveJsonPath, "utf8"));
    // dark overrides come from both files (primitive.json carries shadow.soft/md darks)
    const expected = countDarkExtensions(semantic) + countDarkExtensions(primitive);
    expect(expected).toBeGreaterThan(0);
    const css = readCss("tokens.dark.css");
    // every extension is emitted twice — once per activation path
    // (media-query block + data-theme block)
    const decls = css.match(/^\s*--[a-z0-9-]+:/gm) ?? [];
    expect(decls.length).toBe(expected * 2);
  });

  it("tokens.dark.css flips --shadow-soft/-md to high-alpha (matches preset dark) and never flips --shadow-glow (ADR-0013)", () => {
    const css = readCss("tokens.dark.css");
    // soft + md flipped once per activation path (2x each); high-alpha dark values
    expect(
      (css.match(/--shadow-soft: 0 4px 20px -2px rgba\(0, 0, 0, 0\.4\);/g) ?? [])
        .length,
    ).toBe(2);
    expect(
      (
        css.match(
          /--shadow-md: 0 4px 6px -1px rgba\(0, 0, 0, 0\.5\), 0 2px 4px -2px rgba\(0, 0, 0, 0\.4\);/g,
        ) ?? []
      ).length,
    ).toBe(2);
    // glow is brand-fixed: never in the dark file (mirrors preset.css)
    expect(css).not.toContain("--shadow-glow");
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

  it("tokens.dark.css flips the text emphasis ladder to lighter neutral steps (ADR-0016)", () => {
    const css = readCss("tokens.dark.css");
    expect(css).toContain("--color-fg-strong: var(--color-neutral-100)");
    expect(css).toContain("--color-fg-emphasis: var(--color-neutral-200)");
    expect(css).toContain("--color-fg-secondary: var(--color-neutral-300)");
    expect(css).toContain("--color-fg-subtle: var(--color-neutral-500)");
    expect(css).toContain("--color-fg-faint: var(--color-neutral-600)");
  });
});

describe("tokens.primitives.css — color-free contract (1.3.0+ / ADR-0014)", () => {
  it("exists and carries the radius / duration / easing vocabulary", () => {
    const css = readCss("tokens.primitives.css");
    expect(css).toContain("--radius-md: 0.5rem");
    expect(css).toContain("--duration-fast: 150ms");
    expect(css).toContain("--ease-standard: cubic-bezier(0.2, 0, 0, 1)");
  });

  it("has zero --color-* and zero --shadow-* variables", () => {
    const css = readCss("tokens.primitives.css");
    // covers declarations AND var() references
    expect(css).not.toMatch(/--color-/);
    expect(css).not.toMatch(/--shadow-/);
  });

  it("var count matches the radius + duration + easing leaves in primitive.json", () => {
    const primitive = JSON.parse(fs.readFileSync(primitiveJsonPath, "utf8"));
    const countLeaves = (node: unknown): number => {
      if (typeof node !== "object" || node === null) return 0;
      const obj = node as Record<string, unknown>;
      if ("$value" in obj && "$type" in obj) return 1;
      return Object.entries(obj)
        .filter(([key]) => !key.startsWith("$"))
        .reduce((sum, [, value]) => sum + countLeaves(value), 0);
    };
    const expected =
      countLeaves(primitive.radius) +
      countLeaves(primitive.duration) +
      countLeaves(primitive.easing);
    expect(expected).toBeGreaterThan(0);
    const decls = readCss("tokens.primitives.css").match(/^\s*--[a-z0-9-]+:/gm) ?? [];
    expect(decls.length).toBe(expected);
  });
});

describe("root-level proxy files — plain-path resolution (1.3.0+ / ADR-0014)", () => {
  const ROOT_PROXIES = [
    "tokens.css",
    "tokens.scale.css",
    "tokens.semantic.css",
    "tokens.dark.css",
    "tokens.primitives.css",
  ];

  it("each proxy exists as a physical file at the package root (fs check — no exports map involved)", () => {
    // postcss-import / Tailwind v3 CLI resolve
    // "@willink-labs/css-tokens/<name>" as a literal path inside
    // node_modules and never read the `exports` map — the file itself
    // existing at the package root IS the contract.
    for (const name of ROOT_PROXIES) {
      const file = path.join(pkgRoot, name);
      expect(fs.existsSync(file), `${name} missing at package root`).toBe(true);
      expect(fs.readFileSync(file, "utf8")).toContain(`@import "./src/${name}";`);
    }
  });

  it("each proxy target under src/ exists", () => {
    for (const name of ROOT_PROXIES) {
      expect(
        fs.existsSync(path.join(srcDir, name)),
        `src/${name} missing`,
      ).toBe(true);
    }
  });

  it("the exports map resolves every subpath to the root proxy (require.resolve self-reference)", () => {
    const require = createRequire(import.meta.url);
    for (const name of ROOT_PROXIES) {
      const resolved = require.resolve(`@willink-labs/css-tokens/${name}`);
      expect(fs.existsSync(resolved)).toBe(true);
      expect(path.basename(resolved)).toBe(name);
      // the map must point at the root proxy, not the src/ file
      expect(path.basename(path.dirname(resolved))).not.toBe("src");
    }
  });

  it("the exports map keeps the physical src/ paths importable (pilot workaround stays valid)", () => {
    const require = createRequire(import.meta.url);
    const resolved = require.resolve(
      "@willink-labs/css-tokens/src/tokens.scale.css",
    );
    expect(fs.existsSync(resolved)).toBe(true);
    expect(path.basename(path.dirname(resolved))).toBe("src");
  });

  it("package.json `files` whitelists every root proxy so npm pack ships them", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(pkgRoot, "package.json"), "utf8"),
    );
    for (const name of ROOT_PROXIES) {
      expect(pkg.files, `files[] missing ${name}`).toContain(name);
      expect(pkg.exports[`./${name}`]).toBe(`./${name}`);
    }
  });
});
