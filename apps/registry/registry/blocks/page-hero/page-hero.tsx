import { Badge, Button } from '@willink-labs/react';

/**
 * PageHero — a centered marketing hero composing the @willink-labs/react
 * primitives (Badge + Button). This is a copy-to-own block: edit the copy and
 * layout freely; the Badge/Button styling and `--color-brand` theming come from
 * the npm packages — a consumer's single `--color-brand` override re-themes it
 * (ADR-0020).
 */
export function PageHero({
  eyebrow = 'NEW',
  title = 'プロダクトを、もっと速く届ける。',
  description = '一貫した UI を、ブランドカラー 1 行で。willink design system は token 駆動の React コンポーネント群です。',
  primaryAction = { label: 'はじめる', href: '#' },
  secondaryAction = { label: 'ドキュメント', href: '#' },
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string } | null;
}) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center">
      {eyebrow ? <Badge variant="outline">{eyebrow}</Badge> : null}

      <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-5xl">{title}</h1>

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
