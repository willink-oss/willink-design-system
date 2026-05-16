import { describe, expect, it } from "vitest";
import primitive from "../src/primitive.json" with { type: "json" };
import semantic from "../src/semantic.json" with { type: "json" };

const HEX = /^#[0-9a-f]{6}$/i;

type TokenLeaf = { $value: string; $type: string };
type TokenTree = { [k: string]: TokenLeaf | TokenTree };

function isLeaf(node: unknown): node is TokenLeaf {
  return typeof node === "object" && node !== null && "$value" in node && "$type" in node;
}

function* walkLeaves(tree: TokenTree, path: string[] = []): Generator<{ path: string[]; leaf: TokenLeaf }> {
  for (const [key, value] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;
    const next = [...path, key];
    if (isLeaf(value)) {
      yield { path: next, leaf: value };
    } else if (typeof value === "object" && value !== null) {
      yield* walkLeaves(value as TokenTree, next);
    }
  }
}

describe("primitive.json", () => {
  it("color leaves are valid 6-digit hex", () => {
    const colors = primitive.color as TokenTree;
    for (const { path, leaf } of walkLeaves(colors)) {
      expect(leaf.$type, `${path.join(".")} $type`).toBe("color");
      expect(leaf.$value, `${path.join(".")} $value`).toMatch(HEX);
    }
  });

  it("has neutral 50 and 950 (light/dark anchors)", () => {
    expect(primitive.color.neutral["50"].$value).toBe("#f8fafc");
    expect(primitive.color.neutral["950"].$value).toBe("#020617");
  });

  it("brand scale is i-willink.com 準拠 (vibrant violet)", () => {
    expect(primitive.color.brand["500"].$value).toBe("#8b5cf6");
    expect(primitive.color.brand["600"].$value).toBe("#7c3aed");
    expect(primitive.color.brand["700"].$value).toBe("#6d28d9");
  });

  it("has AI accent primitives (cyan + pink)", () => {
    expect(primitive.color.cyan["500"].$value).toBe("#06b6d4");
    expect(primitive.color.pink["500"].$value).toBe("#ec4899");
  });
});

describe("semantic.json", () => {
  it("has the required semantic color slots", () => {
    const required = ["bg", "fg", "muted", "border", "ring", "brand", "brand-fg", "brand-glow", "accent-cyan", "accent-pink"];
    for (const slot of required) {
      expect(semantic.color, `slot ${slot}`).toHaveProperty(slot);
    }
  });
});
