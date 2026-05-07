import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges plain class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", false, null, undefined, 0, "bar")).toBe("foo bar");
  });

  it("supports object form", () => {
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
  });

  it("merges conflicting tailwind classes (later wins)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("preserves arbitrary brand-aware classes", () => {
    expect(cn("bg-brand", "text-brand-fg")).toBe("bg-brand text-brand-fg");
  });
});
