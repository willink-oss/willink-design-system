/**
 * output-parity gate — the committed CSS outputs must match a fresh generation
 * from the @willink-labs/tokens JSON sources.
 *
 * `scripts/generate.mjs` derives the 5 src/*.css files from
 * packages/tokens/src/{primitive,semantic}.json, and those files are committed.
 * Without this gate a dev can edit a token JSON and commit stale CSS: the
 * existing `generated.test.ts` only validates CSS *content* (not freshness) so
 * `pnpm -r test` passes, and `pnpm -r build` silently regenerates — so the drift
 * never surfaces in review. This regenerates into a temp dir (via the
 * CSS_TOKENS_OUT_DIR override, so committed files are never touched) and asserts
 * byte-equality. Same shape as check-tokens / check-safelist-emission
 * (derived output compared against its source of truth).
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PKG_ROOT = join(__dirname, ".."); // packages/css-tokens
const GENERATE = join(PKG_ROOT, "scripts", "generate.mjs");
const SRC_DIR = join(PKG_ROOT, "src");

// the 5 generated CSS outputs (scripts/generate.mjs writes these to <out>/src)
const CSS_FILES = [
  "tokens.scale.css",
  "tokens.semantic.css",
  "tokens.css",
  "tokens.dark.css",
  "tokens.primitives.css",
];

const tmp = mkdtempSync(join(tmpdir(), "css-tokens-parity-"));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

describe("check-output-parity (committed CSS ↔ tokens JSON)", () => {
  it("regenerating from the token sources reproduces the committed CSS byte-for-byte", () => {
    // generate.mjs reads tokens/src relative to its own location, so input is
    // always the real source; only the output is redirected into the temp dir.
    execFileSync("node", [GENERATE], {
      env: { ...process.env, CSS_TOKENS_OUT_DIR: tmp },
      stdio: "pipe",
    });

    const drifted: string[] = [];
    for (const name of CSS_FILES) {
      const committed = readFileSync(join(SRC_DIR, name), "utf8");
      const fresh = readFileSync(join(tmp, "src", name), "utf8");
      if (committed !== fresh) drifted.push(name);
    }

    if (drifted.length > 0) {
      console.error(
        "\n  css-tokens output drift: committed src/*.css is stale vs packages/tokens/src/*.json.\n" +
          "  Run `pnpm -F @willink-labs/css-tokens generate` and commit:\n" +
          drifted.map((d) => `    - src/${d}`).join("\n"),
      );
    }
    expect(drifted).toEqual([]);
  });
});
