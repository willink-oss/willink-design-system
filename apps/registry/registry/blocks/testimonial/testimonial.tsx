import { Avatar, AvatarFallback, AvatarImage, Card, CardContent } from '@willink-labs/react';

/**
 * Testimonial — a customer-quote card composing the @willink-labs/react
 * primitives (Card + Avatar). This is a copy-to-own block: edit the quote,
 * attribution, and layout freely; the primitive styling and `--color-brand`
 * theming come from the npm packages (ADR-0020). The avatar falls back to the
 * person's initials when no image is provided.
 */
export function Testimonial({
  quote = 'ブランドカラーを 1 行変えるだけで、プロダクト全体の UI が一貫して整いました。導入の速さに驚いています。',
  name = '山田 花子',
  role = 'プロダクトマネージャー, 株式会社サンプル',
  avatarSrc,
  avatarFallback = '山田',
}: {
  quote?: string;
  name?: string;
  role?: string;
  avatarSrc?: string;
  avatarFallback?: string;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        {/* <figure>/<figcaption> tie the attribution to the quote for assistive tech. */}
        <figure className="flex flex-col gap-4">
          <blockquote className="text-lg leading-relaxed text-fg">
            <span aria-hidden className="mr-1 text-brand">
              “
            </span>
            {quote}
          </blockquote>
          <figcaption className="flex items-center gap-3">
            <Avatar>
              {avatarSrc ? <AvatarImage src={avatarSrc} alt={name || avatarFallback} /> : null}
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <span className="flex flex-col">
              <cite className="font-medium not-italic text-fg">{name}</cite>
              {role ? <span className="text-sm text-muted">{role}</span> : null}
            </span>
          </figcaption>
        </figure>
      </CardContent>
    </Card>
  );
}
