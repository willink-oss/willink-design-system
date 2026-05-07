"use client";

import { BRANDS, type Brand } from "@willink-labs/tailwind-preset";
import { useEffect, useState } from "react";

export default function Page() {
  const [brand, setBrand] = useState<Brand>("i-willink");

  useEffect(() => {
    document.documentElement.setAttribute("data-brand", brand);
  }, [brand]);

  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">willink-design-system playground</h1>
        <p className="text-muted text-sm">
          Phase 0 — token + Tailwind v4 preset の動作確認。
          <code className="bg-neutral-100 px-1 rounded text-xs">
            data-brand="{brand}"
          </code>
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Brand axis</h2>
        <div className="flex gap-2">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`px-4 py-2 rounded-md border transition-colors ${
                brand === b
                  ? "bg-brand text-brand-fg border-brand"
                  : "bg-bg text-fg border-border hover:border-brand"
              }`}
              style={{ transitionDuration: "var(--duration-base)" }}
            >
              {b}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Buttons</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <button className="bg-brand text-brand-fg px-4 py-2 rounded-md font-medium shadow-soft hover:opacity-90">
            Primary
          </button>
          <button className="bg-bg text-fg border border-border px-4 py-2 rounded-md font-medium hover:border-brand">
            Secondary
          </button>
          <button className="bg-accent text-white px-4 py-2 rounded-md font-medium">
            Accent
          </button>
          <button className="bg-success text-white px-4 py-2 rounded-md font-medium">
            Success
          </button>
          <button className="bg-danger text-white px-4 py-2 rounded-md font-medium">
            Danger
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Color swatches (semantic)</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {(["bg", "fg", "muted", "border", "brand", "brand-fg", "accent", "success", "warning", "danger"] as const).map(
            (name) => (
              <div key={name} className="border border-border rounded-md overflow-hidden">
                <div
                  className="h-16"
                  style={{ background: `var(--color-${name})` }}
                />
                <div className="px-2 py-1 text-xs">
                  <div className="font-mono">--color-{name}</div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Radii</h2>
        <div className="flex gap-3 items-center">
          {(["sm", "md", "lg", "xl", "full"] as const).map((r) => (
            <div
              key={r}
              className="w-16 h-16 bg-brand text-brand-fg flex items-center justify-center text-xs font-mono"
              style={{ borderRadius: `var(--radius-${r})` }}
            >
              {r}
            </div>
          ))}
        </div>
      </section>

      <section className="text-xs text-muted">
        <p>
          このページは v0.1.0 Phase 0 のリファレンス実装。Storybook の代替として
          全コンポーネントを 1 ページに集約 (過去頓挫パターンの回避)。
        </p>
      </section>
    </main>
  );
}
