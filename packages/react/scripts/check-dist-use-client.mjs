#!/usr/bin/env node
/**
 * Build-output regression check — every emitted JS file in dist/ must START
 * with the 'use client' directive (very first statement, before any import).
 *
 * Why: @willink-labs/react executes client-only code at module top level
 * (createContext in FormField, hooks throughout). esbuild strips source-level
 * directives during bundling, so without the tsup `banner` the published dist
 * carries no directive at all and `next build` crashes for any RSC consumer
 * importing from a Server Component (production-discovered in the
 * clublink-platform rollout, @willink-labs/react@1.4.0). The directive is only
 * honored as the first statement of the module — position matters, hence the
 * startsWith assertion rather than a containment grep.
 *
 * Runs as part of `pnpm build` (`tsup && node ./scripts/check-dist-use-client.mjs`)
 * so the uniform CI gate (`pnpm -r build`, ADR-0012 Layer 0) enforces it forever.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist", import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  "$1",
);

// Accept either quote style; require it as the very first bytes of the file.
const DIRECTIVE = /^(['"])use client\1;?/;

const jsFiles = readdirSync(DIST).filter(
  (f) => /\.(js|mjs|cjs)$/.test(f) && !f.endsWith(".d.ts"),
);

if (jsFiles.length === 0) {
  console.error(`✗ No JS build output found in ${DIST} — run tsup first.`);
  process.exit(1);
}

const failures = [];
for (const f of jsFiles) {
  const head = readFileSync(join(DIST, f), "utf8").slice(0, 64);
  if (!DIRECTIVE.test(head)) {
    failures.push(`${f} — first bytes: ${JSON.stringify(head.slice(0, 32))}`);
  }
}

if (failures.length > 0) {
  console.error("✗ dist output missing leading 'use client' directive:");
  for (const f of failures) console.error(`  - ${f}`);
  console.error(
    "\nThe tsup banner (tsup.config.ts → banner.js) must emit 'use client' as",
  );
  console.error(
    "the first line of every dist JS file, or RSC consumers (Next.js App",
  );
  console.error("Router) crash at next build. Do not remove it.");
  process.exit(1);
}

console.log(
  `✓ 'use client' directive leads ${jsFiles.length} dist file(s): ${jsFiles.join(", ")}`,
);
