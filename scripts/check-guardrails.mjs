#!/usr/bin/env node
/**
 * Guardrail check — Phase 0 で意図的に入れない tooling が紛れ込んでいないか確認する。
 * 過去 2 回の DS 試行 (i-Willink-Design-System / Design-System-Development-bk) は
 * husky / lint-staged / secretlint / markuplint / prettier 等の整備に時間を吸われて
 * src/ がほぼ空のまま停止した。本スクリプトはその回帰を防ぐ。
 *
 * 解禁条件: 同 PR で生産的成果物 (token or component) を 1 個以上追加する場合のみ。
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const FORBIDDEN_FILES = [
  ".husky",
  ".lintstagedrc.js",
  ".lintstagedrc.json",
  ".lintstagedrc.cjs",
  ".secretlintrc.json",
  ".secretlintrc.js",
  ".markuplintrc",
  ".markuplintrc.json",
];

const FORBIDDEN_DEPS = [
  "husky",
  "lint-staged",
  "secretlint",
  "markuplint",
  "@markuplint/jsx-parser",
  "@secretlint/secretlint-rule-preset-recommend",
];

const errors = [];

for (const f of FORBIDDEN_FILES) {
  if (existsSync(join(ROOT, f))) {
    errors.push(`Forbidden tooling file present: ${f}`);
  }
}

function checkPackageJson(path) {
  if (!existsSync(path)) return;
  const pkg = JSON.parse(readFileSync(path, "utf8"));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const dep of FORBIDDEN_DEPS) {
    if (dep in allDeps) {
      errors.push(`Forbidden dependency in ${path}: ${dep}`);
    }
  }
}

checkPackageJson(join(ROOT, "package.json"));

for (const group of ["packages", "apps"]) {
  const dir = join(ROOT, group);
  if (!existsSync(dir)) continue;
  for (const sub of readdirSync(dir)) {
    checkPackageJson(join(dir, sub, "package.json"));
  }
}

// --- Beta-channel isolation must not silently regress (ADR-0019) ---
// Pre-release versions (incl. autonomously cut ones) are only safe while
// publish.yml routes EVERY publish through the resolved dist-tag. This is a
// semantic check, not a string-presence tripwire: it inspects the actual
// `pnpm ... publish` command lines (comments stripped), so a rewrite that keeps
// the marker strings alive in comments/dead branches but hard-codes `--tag latest`
// on the real publish step is still caught.
function checkBetaIsolation() {
  const wf = join(ROOT, ".github/workflows/publish.yml");
  if (!existsSync(wf)) {
    errors.push("publish.yml is missing — cannot verify beta-channel isolation (ADR-0019).");
    return;
  }
  const lines = readFileSync(wf, "utf8").split("\n");
  const strip = (l) => l.replace(/#.*$/, ""); // drop trailing YAML/shell comment
  const code = lines.map(strip).join("\n");

  const publishLines = lines.filter((l) =>
    /pnpm\s+-F\s+@willink-labs\/\S+\s+publish/.test(strip(l)),
  );
  if (publishLines.length === 0) {
    errors.push(
      "publish.yml: no `pnpm -F @willink-labs/* publish` command found — cannot verify beta isolation (ADR-0019).",
    );
  }
  for (const l of publishLines) {
    const c = strip(l);
    if (!c.includes('--tag "$DIST_TAG"')) {
      errors.push(
        `publish.yml: a publish step is not routed through the resolved dist-tag ` +
          `(missing \`--tag "$DIST_TAG"\`): \`${l.trim()}\`. A pre-release could leak to 'latest' (ADR-0019).`,
      );
    }
    if (/--tag\s+(latest|beta|rc|alpha|next)\b/.test(c)) {
      errors.push(
        `publish.yml: a publish step hard-codes a dist-tag instead of using "$DIST_TAG": ` +
          `\`${l.trim()}\` (ADR-0019).`,
      );
    }
  }
  if (!/DIST_TAG=/.test(code) || !/GITHUB_ENV/.test(code)) {
    errors.push("publish.yml: DIST_TAG is not computed and exported in a real (non-comment) line (ADR-0019).");
  }
  if (!code.includes("Refusing to publish pre-release")) {
    errors.push("publish.yml: missing the pre-release→latest refusal assertion in a real line (ADR-0019).");
  }
}
checkBetaIsolation();

if (errors.length > 0) {
  console.error("✗ Guardrail violations:");
  for (const e of errors) console.error(`  - ${e}`);
  console.error("\nIf intentional, this PR must also add at least one productive artifact (token or component).");
  console.error("See README.md > 'Why no husky / lint-staged / secretlint / markuplint'.");
  process.exit(1);
}

console.log("✓ Guardrails OK — no excess tooling detected.");
