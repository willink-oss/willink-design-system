import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
} from '@willink-labs/react';

/**
 * TestimonialWall — a multi-quote social-proof wall composing the
 * @willink-labs/react primitives (Card + Avatar + Badge). This extends the
 * single Testimonial block into a responsive masonry-ish wall. It is a
 * copy-to-own block: edit the heading and testimonials freely; the primitive
 * styling and `--color-brand` theming come from the npm packages — a consumer's
 * single `--color-brand` override re-themes the whole wall (ADR-0020). No icons
 * (dependency-free) and no block-level hooks → server component.
 *
 * Layout uses CSS multi-columns (`columns-1 sm:columns-2 lg:columns-3`) so
 * variable-height quote cards pack into a masonry-like flow; each Card carries
 * `break-inside-avoid` so a card never splits across columns.
 *
 * Each Card renders (mirroring the Testimonial block): an optional tag Badge,
 * a <figure>/<blockquote>/<figcaption> so attribution is tied to the quote for
 * assistive tech, an Avatar (image, or initials fallback when `avatarSrc` is
 * omitted), the name as a non-italic <cite>, and an optional role.
 *
 * a11y: figure/figcaption associate each attribution with its quote;
 * AvatarImage carries `alt={name}`; the decorative opening quote glyph is
 * `aria-hidden`; <cite> is `not-italic`.
 */
export function TestimonialWall({
  heading = 'お客様の声',
  testimonials = [
    {
      quote:
        'ブランドカラーを 1 行変えるだけで、プロダクト全体の UI が一貫して整いました。導入の速さに本当に驚いています。',
      name: '山田 花子',
      role: 'プロダクトマネージャー, 株式会社サンプル',
      avatarFallback: '山田',
      tag: '導入事例',
    },
    {
      quote:
        'デザイントークンが整理されているおかげで、デザイナーとエンジニアの会話がスムーズになりました。手戻りが激減しています。',
      name: '佐藤 健',
      role: 'デザインリード, テック合同会社',
      avatarFallback: '佐藤',
      tag: 'デザイン',
    },
    {
      quote:
        'アクセシビリティ対応が最初から組み込まれているので、安心して機能開発に集中できます。監査の指摘もほぼゼロになりました。',
      name: '鈴木 美咲',
      role: 'フロントエンドエンジニア',
      avatarFallback: '鈴木',
      tag: 'a11y',
    },
    {
      quote:
        'ダークモードの切り替えがトークンだけで完結するのが素晴らしい。個別の調整がいらず、運用コストが大幅に下がりました。',
      name: '田中 翔',
      role: 'テックリード, スタートアップ A 社',
      avatarFallback: '田中',
    },
    {
      quote:
        'コンポーネントを自分のリポジトリにコピーして所有できるので、将来の拡張に不安がありません。ロックインのない設計が決め手でした。',
      name: '高橋 由紀',
      role: 'エンジニアリングマネージャー',
      avatarFallback: '高橋',
      tag: '拡張性',
    },
    {
      quote:
        'ドキュメントが丁寧で、新しいメンバーのオンボーディングが驚くほど早くなりました。チーム全体の生産性が底上げされています。',
      name: '伊藤 大輔',
      role: 'VP of Engineering, 株式会社ビヨンド',
      avatarFallback: '伊藤',
      tag: 'チーム',
    },
  ],
}: {
  heading?: string | null;
  testimonials?: {
    quote: string;
    name: string;
    role?: string;
    avatarSrc?: string;
    avatarFallback: string;
    tag?: string;
  }[];
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      {heading ? (
        <h2 className="mb-10 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          {heading}
        </h2>
      ) : null}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {testimonials.map((testimonial, i) => (
          <Card
            key={`${testimonial.name}-${i}`}
            className="mb-4 break-inside-avoid"
          >
            <CardContent className="pt-6">
              {/* <figure>/<figcaption> tie the attribution to the quote for assistive tech. */}
              <figure className="flex flex-col gap-4">
                {testimonial.tag ? (
                  <Badge variant="outline" className="self-start">
                    {testimonial.tag}
                  </Badge>
                ) : null}

                <blockquote className="leading-relaxed text-fg">
                  <span aria-hidden className="mr-1 text-brand">
                    “
                  </span>
                  {testimonial.quote}
                </blockquote>

                <figcaption className="flex items-center gap-3">
                  <Avatar>
                    {testimonial.avatarSrc ? (
                      <AvatarImage
                        src={testimonial.avatarSrc}
                        alt={testimonial.name}
                      />
                    ) : null}
                    <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col">
                    <cite className="font-medium not-italic text-fg">
                      {testimonial.name}
                    </cite>
                    {testimonial.role ? (
                      <span className="text-sm text-muted">
                        {testimonial.role}
                      </span>
                    ) : null}
                  </span>
                </figcaption>
              </figure>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
