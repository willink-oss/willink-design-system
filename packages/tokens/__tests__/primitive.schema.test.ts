import { describe, expect, it } from "vitest";
import primitive from "../src/primitive.json" with { type: "json" };
import semantic from "../src/semantic.json" with { type: "json" };
import iWillink from "../src/brand/i-willink.json" with { type: "json" };
import clublink from "../src/brand/clublink.json" with { type: "json" };

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
});

describe("semantic.json", () => {
  it("has the 9 required semantic color slots", () => {
    const required = ["bg", "fg", "muted", "border", "ring", "brand", "brand-fg", "accent"];
    for (const slot of required) {
      expect(semantic.color, `slot ${slot}`).toHaveProperty(slot);
    }
  });
});

describe("brand definitions", () => {
  it("each brand defines brand / brand-fg / accent", () => {
    for (const brandFile of [iWillink, clublink]) {
      expect(brandFile.color.brand.$value).toMatch(HEX);
      expect(brandFile.color["brand-fg"].$value).toMatch(HEX);
      expect(brandFile.color.accent.$value).toMatch(HEX);
    }
  });

  it("i-willink brand is purple-700 #7c3aed", () => {
    expect(iWillink.color.brand.$value).toBe("#7c3aed");
  });

  it("clublink brand is blue-600 #2563eb", () => {
    expect(clublink.color.brand.$value).toBe("#2563eb");
  });
});
