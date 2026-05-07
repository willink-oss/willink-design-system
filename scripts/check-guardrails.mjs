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

if (errors.length > 0) {
  console.error("✗ Guardrail violations:");
  for (const e of errors) console.error(`  - ${e}`);
  console.error("\nIf intentional, this PR must also add at least one productive artifact (token or component).");
  console.error("See README.md > 'Why no husky / lint-staged / secretlint / markuplint'.");
  process.exit(1);
}

console.log("✓ Guardrails OK — no excess tooling detected.");
