import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@willink-labs/react';

/**
 * TeamGrid — a responsive team / people grid composing the @willink-labs/react
 * primitives (Card + Avatar + Badge + HoverCard). This is a copy-to-own block:
 * edit the heading and members freely; the primitive styling and `--color-brand`
 * theming come from the npm packages — a consumer's single `--color-brand`
 * override re-themes it (ADR-0020). No icons (dependency-free), no block-level
 * hooks → server component.
 *
 * Each member renders as a centered Card with an Avatar (image, or initials
 * fallback when `avatarSrc` is omitted), the name, and a role Badge. When a
 * `bio` is present the name becomes a HoverCard trigger: a focusable `<button>`
 * (so the bio is reachable by hover AND keyboard focus) whose HoverCardContent
 * reveals the bio. Members without a bio render the name as plain text.
 *
 * a11y: AvatarImage carries `alt={name}`; the HoverCard trigger is a real
 * `<button>` with the member's name as its accessible name; role text stays
 * visible in the Badge.
 */
export function TeamGrid({
  heading = 'チームメンバー',
  members = [
    {
      name: '山田 花子',
      role: 'CEO / 共同創業者',
      avatarFallback: '山田',
      bio: '15 年にわたりプロダクト開発をリード。デザインとエンジニアリングの橋渡しを得意とし、チーム文化の醸成に注力しています。',
    },
    {
      name: '佐藤 健',
      role: 'CTO',
      avatarFallback: '佐藤',
      bio: '分散システムとフロントエンド基盤の専門家。design system のアーキテクチャ全体を統括しています。',
    },
    {
      name: '鈴木 美咲',
      role: 'デザインリード',
      avatarFallback: '鈴木',
      bio: 'アクセシビリティとトークン駆動デザインの推進役。ブランド一貫性を保ちながら UI を進化させています。',
    },
    {
      name: '田中 翔',
      role: 'エンジニア',
      avatarFallback: '田中',
      bio: 'コンポーネントライブラリの中核を担う開発者。型安全な API 設計とテスト整備に情熱を注いでいます。',
    },
  ],
}: {
  heading?: string | null;
  members?: {
    name: string;
    role: string;
    avatarSrc?: string;
    avatarFallback: string;
    bio?: string;
  }[];
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      {heading ? (
        <h2 className="mb-10 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          {heading}
        </h2>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member, i) => (
          <Card key={`${member.name}-${i}`}>
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <Avatar className="h-16 w-16">
                {member.avatarSrc ? (
                  <AvatarImage src={member.avatarSrc} alt={member.name} />
                ) : null}
                <AvatarFallback>{member.avatarFallback}</AvatarFallback>
              </Avatar>

              {member.bio ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    {/* Real <button> → focusable + keyboard-reachable; the name is
                        its accessible name. Styled to read as the inline name. */}
                    <button
                      type="button"
                      className="rounded-sm font-medium text-fg underline decoration-dotted underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      {member.name}
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <p className="text-sm leading-relaxed text-fg-secondary">
                      {member.bio}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <span className="font-medium text-fg">{member.name}</span>
              )}

              <Badge variant="outline">{member.role}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
