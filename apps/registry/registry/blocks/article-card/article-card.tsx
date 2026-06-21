import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@willink-labs/react';

/**
 * ArticleCard — a blog/article preview card composing the @willink-labs/react
 * primitives (Card + Badge + Avatar + Button). This is a copy-to-own block:
 * edit the copy, byline, and layout freely; the primitive styling and
 * `--color-brand` theming come from the npm packages (ADR-0020). Render several
 * in a grid for a blog index. No block-level state — this is a Server Component.
 *
 * @example
 *   <ArticleCard
 *     category="エンジニアリング"
 *     title="デザインシステムを 1 行で導入する"
 *     href="/blog/design-system"
 *     author={{ name: '山田 花子', avatarFallback: '山田' }}
 *     date="2026-06-21"
 *   />
 */
export function ArticleCard({
  category = 'エンジニアリング',
  title = 'デザインシステムを 1 行で導入する方法',
  excerpt = 'ブランドカラーを 1 行変えるだけで、プロダクト全体の UI を一貫して整える方法を解説します。',
  href = '#',
  author = { name: '山田 花子', avatarFallback: '山田' },
  date = '2026-06-21',
  readMoreLabel = '続きを読む',
}: {
  category?: string;
  title?: string;
  excerpt?: string;
  /** Article URL — wired to the title link and the read-more button. */
  href?: string;
  author?: { name: string; avatarSrc?: string; avatarFallback: string };
  /** Machine-readable date string (rendered inside <time dateTime>). */
  date?: string;
  readMoreLabel?: string;
}) {
  return (
    <Card variant="elevated" className="flex w-full max-w-md flex-col">
      <CardHeader>
        {category ? (
          <Badge variant="outline" className="w-fit">
            {category}
          </Badge>
        ) : null}
        <CardTitle className="text-xl">
          {/* The title doubles as the primary link into the article. */}
          <a href={href} className="transition-colors hover:text-brand">
            {title}
          </a>
        </CardTitle>
        {excerpt ? <CardDescription>{excerpt}</CardDescription> : null}
      </CardHeader>

      <CardFooter className="mt-auto justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {author.avatarSrc ? (
              <AvatarImage src={author.avatarSrc} alt={author.name} />
            ) : null}
            <AvatarFallback>{author.avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm text-muted">
            <span className="font-medium text-fg">{author.name}</span>
            {date ? <time dateTime={date}>{date}</time> : null}
          </div>
        </div>

        {/* Read-more navigates to the article; the accessible name keeps the
            visible label as a substring (WCAG 2.5.3 Label in Name) while naming
            the target article for assistive tech. */}
        <Button asChild variant="link" size="sm" className="shrink-0">
          <a href={href} aria-label={`${readMoreLabel}: ${title}`}>
            {readMoreLabel}
            <span aria-hidden>→</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
