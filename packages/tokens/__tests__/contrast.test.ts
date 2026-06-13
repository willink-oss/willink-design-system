/**
 * Contrast audit gate (1.2.0+ / ADR-0013) — executes the repo-level
 * scripts/check-contrast.mjs and asserts it exits 0, so the WCAG 2.1
 * thresholds for the semantic palette (light AND dark) are enforced by
 * `pnpm -r test` / quality-gate forever. A token PR that pushes a required
 * pair (fg/bg, muted/bg, brand-fg/brand, brand-soft-fg/brand-soft,
 * surface-inverted pairs, dark feedback-on-bg) below its threshold fails CI.
 *
 * As of 1.7.0 (ADR-0018) the same gate also covers `bg-clip-text` GRADIENT
 * headings (the prior audit blind spot): the script's TEXT_GRADIENTS registry
 * asserts each text-clipped gradient utility's WORST endpoint clears the floor
 * against `bg` in dark (required) — so a clipped heading that washes out on the
 * dark background (the defect caught twice by manual review) now fails CI.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(__dirname, "../../../scripts/check-contrast.mjs");

describe("contrast audit (scripts/check-contrast.mjs)", () => {
  it("all required WCAG 2.1 pairs pass in light and dark mode (exit 0)", () => {
    const result = spawnSync(process.execPath, [script], { encoding: "utf8" });
    if (result.status !== 0) {
      // surface the script's report so the failing pair is visible in CI logs
      console.error(result.stdout);
      console.error(result.stderr);
    }
    expect(result.status).toBe(0);
  });
});
