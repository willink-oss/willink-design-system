import { Badge, Button } from '@willink-labs/react';

/**
 * CtaSection — an end-of-page call-to-action band composing the
 * @willink-labs/react primitives (Badge + Button). This is a copy-to-own block:
 * edit the copy, layout, and surface freely; the primitive styling and
 * `--color-brand` theming come from the npm packages — a consumer's single
 * `--color-brand` override re-themes both CTAs (ADR-0020). No hooks → server
 * component. The buttons use `asChild` to render real <a href> links.
 */
export function CtaSection({
  eyebrow = 'はじめましょう',
  title = '今日から、ブランドカラー 1 行で。',
  description =
    'willink design system は token 駆動の React コンポーネント群です。導入は数分、テーマ変更は一行で完了します。',
  primaryAction = { label: '無料で始める', href: '#' },
  secondaryAction = { label: 'お問い合わせ', href: '#' },
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string } | null;
}) {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-xl border border-border bg-surface-subtle px-6 py-12 text-center">
      {eyebrow ? <Badge variant="outline">{eyebrow}</Badge> : null}

      <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>

      <p className="max-w-xl text-lg text-muted">{description}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <a href={primaryAction.href}>{primaryAction.label}</a>
        </Button>
        {secondaryAction ? (
          <Button asChild variant="outline" size="lg">
            <a href={secondaryAction.href}>{secondaryAction.label}</a>
          </Button>
        ) : null}
      </div>
    </section>
  );
}
