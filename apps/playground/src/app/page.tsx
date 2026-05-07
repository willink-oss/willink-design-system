"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "@willink-labs/react";
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
            {/* Tagline (Badge コンポーネント差替後) */}
            <Badge className="mb-8 gap-2 px-4 py-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              willink-design-system v0.1.0 — Phase 1
            </Badge>

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

            {/* Brand toggle (Button asChild なしで直接 onClick) */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {BRANDS.map((b) => (
                <Button
                  key={b}
                  size="lg"
                  variant={b === brand ? "default" : "outline"}
                  onClick={() => setBrand(b)}
                >
                  Brand: {b}
                  {b === brand && <ArrowRight className="w-4 h-4" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
       * BUTTONS section — @willink-labs/react Button
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-2">Buttons</h2>
        <p className="text-sm text-muted mb-6">
          <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-neutral-100">
            @willink-labs/react
          </code>{" "}
          ─ variants <code className="font-mono">default / outline / ghost / link</code>
          、sizes <code className="font-mono">sm / md / lg</code>。
          Primary は brand-600 + brand-500/20 glow shadow (i-willink.com 本番準拠)。
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted">Variants (size=md)</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button>
                Primary <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link button</Button>
              <Button asChild>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  asChild → &lt;a&gt;
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted">Sizes (variant=default)</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="md" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
       * BADGES section — @willink-labs/react Badge
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Badges</h2>
        <p className="text-sm text-muted mb-6">
          variants <code className="font-mono">default / outline / success / warning / danger</code>
          。default は brand-100 + brand-700 (subtle・brand 切替で自動追従)。
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </section>

      {/* ============================================================
       * FORM section — Input + Textarea + Label
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Form primitives</h2>
        <p className="text-sm text-muted mb-6">
          Input / Textarea / Label。error 状態は <code className="font-mono">aria-invalid</code> で。
          Label の <code className="font-mono">required</code> prop で danger 色のアスタリスク表示。
        </p>
        <form
          className="grid gap-4 max-w-md p-6 rounded-xl border border-border bg-bg"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-1.5">
            <Label htmlFor="ds-name" required>
              お名前
            </Label>
            <Input id="ds-name" placeholder="山田 太郎" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ds-email" required>
              メールアドレス
            </Label>
            <Input id="ds-email" type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ds-email-err" required>
              メール (error 状態)
            </Label>
            <Input
              id="ds-email-err"
              type="email"
              defaultValue="invalid"
              aria-invalid
              aria-describedby="ds-email-err-msg"
            />
            <p id="ds-email-err-msg" className="text-sm text-danger">
              有効なメールアドレスを入力してください。
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ds-message">お問い合わせ内容</Label>
            <Textarea id="ds-message" rows={4} placeholder="どのようなご相談ですか?" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ds-disabled" size="sm">
              Disabled (読み取り専用例)
            </Label>
            <Input id="ds-disabled" disabled defaultValue="読み取り専用" />
          </div>

          <Button type="submit">送信する</Button>
        </form>
      </section>

      {/* ============================================================
       * CARDS section — Feature / Club / Sponsor Plan 3 パターン
       * ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-2">Cards</h2>
        <p className="text-sm text-muted mb-6">
          compound (<code className="font-mono">Card / CardHeader / CardTitle /
            CardDescription / CardContent / CardFooter</code>) + variants{" "}
          <code className="font-mono">default / elevated</code>。
          i-willink.com の Feature Card / clublink-platform の Club Card・Sponsor Plan
          Card 3 パターンを 1 つの compound に集約可能。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Feature Card 風 (i-willink.com) */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Card</CardTitle>
              <CardDescription>i-willink.com 風 — title + 説明文</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-fg">
                サービスの特徴を簡潔に紹介。default variant (border のみ・shadow なし)。
              </p>
            </CardContent>
          </Card>

          {/* Club Card 風 (clublink-platform) */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex gap-1.5 mb-1">
                <Badge variant="default">スポーツ</Badge>
                <Badge variant="outline">東京</Badge>
              </div>
              <CardTitle>i-Willink Running</CardTitle>
              <CardDescription>
                ランニング初心者から完走者まで、走る楽しさを共有するコミュニティ。
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm">
                詳細を見る
              </Button>
            </CardFooter>
          </Card>

          {/* Sponsor Plan Card 風 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>シルバー</CardTitle>
                <Badge variant="success">人気</Badge>
              </div>
              <CardDescription>個人スポンサー向け</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ¥3,000<span className="text-base font-normal text-muted">/月</span>
              </p>
              <ul className="mt-3 space-y-1 text-sm text-fg">
                <li>・公式 SNS へのお名前掲載</li>
                <li>・年次イベント招待</li>
                <li>・限定グッズ進呈</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">スポンサーになる</Button>
            </CardFooter>
          </Card>
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
          willink-design-system v0.1.0 — Phase 1 (Button + Badge ship 済)。
        </p>
        <p className="mt-1">
          Storybook 不採用。本ページが全コンポーネント・全 token のリファレンス実装。
        </p>
      </footer>
    </div>
  );
}
