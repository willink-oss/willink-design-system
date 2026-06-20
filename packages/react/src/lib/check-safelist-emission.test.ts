/**
 * check-safelist-emission — purge-gap regression gate（#1 再発防止）。
 *
 * DS は compiled JS を出荷し、consumer の Tailwind は node_modules を走査しない。
 * よって各コンポーネントが emit する utility class は必ず
 * packages/tailwind-preset/src/safelist.css の `@source inline(...)` で覆われて
 * いなければ consumer build で purge される。これは clublink.jp 5/8 P0 の原因で
 * あり、cycle 1 (Command) / cycle 6 (Menubar) で maker が落として人間 checker
 * だけが捕捉した #1 regression class。それを CI で機械的に塞ぐ。
 *
 * 仕組み（Layer A・静的・hermetic）:
 *   components/**.tsx が emit する class を 3 経路から抽出する:
 *     (1) `cn()` / `cva()` 呼び出し内の文字列リテラル、
 *     (2) 生の `className="..."` / `className={"..."}` 属性リテラル
 *         （progress / navigation-menu / menubar 等が cn を介さず直接付ける）、
 *     (3) `classNames={{ slot: "..." }}` / `classNames: { ... }` オブジェクト値
 *         （Sonner Toast / cmdk 等の slot-class API。toast.tsx は group-[.toast]:*
 *         を cn でも className でもなくここに書く）。
 *   JSDoc `@example` の className を拾わないよう block comment を先に除去する。
 *   そこから「prefix 付き(:)・arbitrary([])・dash(-) を含む高リスク utility」を
 *   取り、brace 展開した safelist に含まれることを保証する。variant 名
 *   (default / ghost / md) は shape filter で除外し false positive を防ぐ。
 *
 * 既知の限界（Layer B が backstop）:
 *   - shape filter は全経路で bare utility（`-`/`:`/`[` を含まない `flex` / `grid`
 *     / `truncate` / `uppercase` 等）を検査対象から外す。これは variant 名
 *     (default / ghost) や Sonner の group marker (group / toaster) の混入による
 *     false positive を避けるための割り切りであり、その代償として「safelist 未登録
 *     の bare utility を新規 component が emit する」purge は静的には検知できない
 *     （現状の出荷 component が emit する bare utility は全て safelist 済を確認済み）。
 *   - runtime-only な Radix/Sonner 由来 class、malformed でも文字列一致して
 *     しまう safelist entry も静的には判定不能。
 *   いずれも `pnpm -r build` + playground の出力 CSS grep（Layer B = 人手/nightly
 *   の ground truth）が最終担保。
 *
 * check-tokens.test.ts / check-motion-contract.test.ts / check-a11y-matrix.test.ts
 * と同系の静的ゲート。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS_DIR = join(__dirname, "..", "components");
const SAFELIST = join(
  __dirname,
  "..",
  "..",
  "..",
  "tailwind-preset",
  "src",
  "safelist.css",
);

// 意図的に safelist に載せない高リスク token があればここに（現状なし）。
// check-tokens の FORBIDDEN リテラルと同じ運用：実害ある例外が出るまで空に保つ。
const ALLOWLIST = new Set<string>([]);

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") continue;
      yield* walk(full);
    } else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) {
      yield full;
    }
  }
}

/**
 * 各 `cn(...)` / `cva(...)` 呼び出しの内側テキストを連結して返す。
 * string-aware かつ括弧バランスを取るので、class 文字列の中の括弧
 * （例: "[&>button:not(:first-child)]:-ml-px"）で region が早く閉じない。
 */
function callRegions(src: string): string {
  const regions: string[] = [];
  const re = /\b(?:cn|cva)\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length;
    const start = i;
    let depth = 1;
    let str: string | null = null;
    for (; i < src.length && depth > 0; i++) {
      const c = src[i];
      if (str) {
        if (c === "\\") {
          i++;
          continue;
        }
        if (c === str) str = null;
      } else if (c === '"' || c === "'" || c === "`") {
        str = c;
      } else if (c === "(") {
        depth++;
      } else if (c === ")") {
        depth--;
      }
    }
    regions.push(src.slice(start, i - 1));
  }
  return regions.join("\n");
}

/** block comment (`/* *​/` ・JSDoc `/** *​/`) を除去。@example 内の className を
 *  emit クラスと誤認しないため、抽出前に必ず通す。 */
function stripBlockComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "");
}

/** code region 内の "..." / '...' 文字列リテラルを空白区切り token に分解。 */
function classTokens(region: string): string[] {
  const tokens: string[] = [];
  const strRe = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  let m: RegExpExecArray | null;
  while ((m = strRe.exec(region))) {
    const content = m[1] ?? m[2] ?? "";
    for (const t of content.split(/\s+/)) if (t) tokens.push(t);
  }
  return tokens;
}

/**
 * 生の `className="..."` / `className='...'` / `className={"..."}` 属性リテラルの
 * class を抽出（cn を介さず直接付与されるもの）。`className={cn(...)}` は引用符が
 * 直後に来ないのでここでは拾わず、callRegions 側で処理される。
 */
function classNameAttrs(src: string): string[] {
  const tokens: string[] = [];
  const re = /className=\{?\s*["']([^"']*)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    for (const t of m[1].split(/\s+/)) if (t) tokens.push(t);
  }
  return tokens;
}

/**
 * `classNames={{ slot: "..." }}` / `classNames: { ... }` のオブジェクト値（Sonner
 * Toast / cmdk 等の slot-class API）の内側テキストを連結して返す。値は純粋な class
 * 文字列なので classTokens でそのまま抽出する。brace-balanced + string-aware なので
 * 入れ子（toastOptions={{ classNames: {...} }}）でも正しく閉じる。
 */
function slotRegions(src: string): string {
  const regions: string[] = [];
  const re = /classNames\s*[=:]\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length; // 直前の "{" の直後から
    const start = i;
    let depth = 1;
    let str: string | null = null;
    for (; i < src.length && depth > 0; i++) {
      const c = src[i];
      if (str) {
        if (c === "\\") {
          i++;
          continue;
        }
        if (c === str) str = null;
      } else if (c === '"' || c === "'" || c === "`") {
        str = c;
      } else if (c === "{") {
        depth++;
      } else if (c === "}") {
        depth--;
      }
    }
    regions.push(src.slice(start, i - 1));
  }
  return regions.join("\n");
}

/**
 * 高リスク shape: variant prefix(:)・arbitrary([)・dash(-) のいずれかを含む。
 * bare word (flex / relative) と variant 名 (default / ghost / md) はこれらを
 * 持たないので除外され、最も多い false positive 源を断つ。purge 事故の実例
 * (data-[state=open]:bg-surface-muted / data-[selected=true]:bg-surface-subtle 等)
 * は全てこの shape に該当する。
 */
function isHighRisk(token: string): boolean {
  return /[-:[]/.test(token);
}

/**
 * Tailwind `@source inline()` の brace 構文を具体 class へ展開。
 * `{a,b,}` → a | b | ""（末尾空メンバ = bare variant）。連続 group は
 * 直積（再帰）。`[...]` は brace ではないので不可侵。
 */
function expandBraces(s: string): string[] {
  const open = s.indexOf("{");
  if (open === -1) return [s];
  const close = s.indexOf("}", open);
  if (close === -1) return [s]; // 不正だがそのまま（malformed は Layer B が担保）
  const prefix = s.slice(0, open);
  const members = s.slice(open + 1, close).split(",");
  const suffixes = expandBraces(s.slice(close + 1));
  const out: string[] = [];
  for (const mem of members) for (const suf of suffixes) out.push(prefix + mem + suf);
  return out;
}

function safelistSet(css: string): Set<string> {
  const set = new Set<string>();
  const re = /@source\s+inline\(\s*"([^"]+)"\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) for (const cls of expandBraces(m[1])) set.add(cls);
  return set;
}

describe("check-safelist-emission (component classes ⊆ tailwind-preset safelist)", () => {
  it("every high-risk utility a component emits is covered by @source inline()", () => {
    const safelist = safelistSet(readFileSync(SAFELIST, "utf8"));
    const misses: string[] = [];
    const seen = new Set<string>();
    for (const file of walk(COMPONENTS_DIR)) {
      const src = stripBlockComments(readFileSync(file, "utf8"));
      const tokens = [
        ...classTokens(callRegions(src)),
        ...classTokens(slotRegions(src)),
        ...classNameAttrs(src),
      ];
      for (const tok of tokens) {
        if (!isHighRisk(tok)) continue;
        if (ALLOWLIST.has(tok)) continue;
        if (safelist.has(tok)) continue;
        const rel = file.replace(COMPONENTS_DIR, "");
        const key = `${rel}::${tok}`;
        if (seen.has(key)) continue;
        seen.add(key);
        misses.push(`${rel}: ${tok}`);
      }
    }
    if (misses.length) {
      console.error("\n  purge-gap 検知: component が emit する class が safelist 未登録:");
      for (const v of misses.sort()) console.error(`    ${v}`);
      console.error(
        '\n  packages/tailwind-preset/src/safelist.css に `@source inline("<class>");` を追加してください。',
      );
    }
    expect(misses).toEqual([]);
  });
});
