"use client";

import { BRANDS, type Brand } from "@willink-labs/tailwind-preset";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [brand, setBrand] = useState<Brand>("willink");

  useEffect(() => {
    document.documentElement.setAttribute("data-brand", brand);
  }, [brand]);

  return (
    <div className="min-h-screen bg-bg text-fg selection:bg-brand-100 selection:text-brand-900 font-sans">
      {/* ============================================================
       * HERO — i-willink.com 本番ライクのリファレンス実装
       * ============================================================ */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-subtle">
        {/* 背景ぼかし円 (premium tech feel) */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              willink-design-system v0.0.2 — Phase 0
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.15]">
              <span className="text-neutral-900">アイデアを、</span>
              <br />
              <span className="text-gradient-primary">かつてない速度で現実に。</span>
            </h1>

            <p className="text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              i-Willink Design System ─ 全プロダクト共通の token 駆動設計。
              <br className="hidden md:block" />
              <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
                data-brand=&quot;{brand}&quot;
              </code>{" "}
              でブランド軸を切替。
            </p>

            {/* Brand toggle (= primary action) */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {BRANDS.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrand(b)}
                  className={
                    b === brand
                      ? "px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 border border-transparent bg-brand text-brand-fg shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
                      : "px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 border bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700"
                  }
                >
                  Brand: {b}
                  {b === brand && <ArrowRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
       * BUTTONS section
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-2">Buttons</h2>
        <p className="text-sm text-muted mb-6">
          Primary は brand-600 + brand-500/20 glow shadow。i-willink.com 本番準拠。
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <button className="px-8 py-4 rounded-full font-bold flex items-center gap-2 border border-transparent bg-brand text-brand-fg shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:bg-brand-700 transition-all">
            Primary <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-8 py-4 rounded-full font-bold border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-all">
            Outline
          </button>
          <button className="px-8 py-4 rounded-full font-bold border border-transparent text-neutral-700 hover:bg-neutral-100 transition-all">
            Ghost
          </button>
          <button className="px-6 py-3 rounded-full font-bold text-white bg-gradient-ai transition-all hover:opacity-90">
            AI Gradient
          </button>
          <button className="px-6 py-3 rounded-full font-bold text-white bg-success">
            Success
          </button>
          <button className="px-6 py-3 rounded-full font-bold text-white bg-danger">
            Danger
          </button>
        </div>
      </section>

      {/* ============================================================
       * GRADIENTS section
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Gradients</h2>
        <p className="text-sm text-muted mb-6">
          brand 軸切替時にグラデーション全体が自動追従。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="h-32 bg-gradient-subtle" />
            <div className="px-3 py-2 text-xs">
              <div className="font-mono">bg-gradient-subtle</div>
              <div className="text-muted">white → brand-50 → sky-50</div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="h-32 bg-gradient-primary" />
            <div className="px-3 py-2 text-xs">
              <div className="font-mono">bg-gradient-primary</div>
              <div className="text-muted">brand → blue-600</div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="h-32 bg-gradient-ai" />
            <div className="px-3 py-2 text-xs">
              <div className="font-mono">bg-gradient-ai</div>
              <div className="text-muted">cyan → brand-500 → pink</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
       * COLOR SWATCHES (semantic)
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Semantic colors</h2>
        <p className="text-sm text-muted mb-6">
          consumer はこの semantic 名のみ参照する (primitive 直参照は禁止)。
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {(
            [
              "bg",
              "fg",
              "muted",
              "border",
              "brand",
              "brand-fg",
              "brand-glow",
              "accent-cyan",
              "accent-pink",
              "success",
              "warning",
              "danger",
            ] as const
          ).map((name) => (
            <div key={name} className="border border-border rounded-lg overflow-hidden">
              <div className="h-16" style={{ background: `var(--color-${name})` }} />
              <div className="px-2 py-1 text-xs">
                <div className="font-mono">--color-{name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
       * BRAND SCALE (primitive)
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Brand scale (primitive)</h2>
        <p className="text-sm text-muted mb-6">
          i-willink.com 本番準拠の vibrant violet スケール。
        </p>
        <div className="grid grid-cols-11 gap-1">
          {([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const).map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className="w-full h-12 rounded"
                style={{ background: `var(--color-brand-${step})` }}
              />
              <div className="text-[10px] font-mono mt-1 text-muted">{step}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
       * RADII
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Radii</h2>
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

      <footer className="max-w-5xl mx-auto px-6 py-12 text-xs text-muted border-t border-border mt-8">
        <p>
          willink-design-system v0.0.2 — Phase 0 + i-willink.com 本番準拠化
          (brand スケール置換・AI accents 追加・グラデ 3 種・Noto Sans JP)。
        </p>
        <p className="mt-1">
          Storybook 不採用。本ページが全コンポーネント・全 token のリファレンス実装。
        </p>
      </footer>
    </div>
  );
}
