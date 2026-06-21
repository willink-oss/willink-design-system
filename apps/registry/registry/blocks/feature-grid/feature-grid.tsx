import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@willink-labs/react';

/**
 * FeatureGrid — a responsive product-feature grid composing the
 * @willink-labs/react primitives (Card + optional Badge). This is a copy-to-own
 * block: edit the heading, eyebrow, and features freely; the Card/Badge styling
 * and `--color-brand` theming come from the npm packages — a consumer's single
 * `--color-brand` override re-themes it (ADR-0020). No icons (dependency-free),
 * no hooks → server component. Each feature renders as a Card with a CardTitle
 * heading and a CardDescription.
 */
export function FeatureGrid({
  eyebrow = 'FEATURES',
  heading = '開発を加速する、必要な機能のすべて。',
  features = [
    {
      title: 'トークン駆動デザイン',
      description:
        'すべての色・余白・タイポグラフィを design token で一元管理。`--color-brand` を 1 行上書きするだけで全体の配色が切り替わります。',
    },
    {
      title: 'アクセシビリティ標準装備',
      description:
        'キーボード操作・スクリーンリーダー対応・適切なコントラストを各コンポーネントに作り込み済み。WCAG 準拠の UI をすぐに構築できます。',
    },
    {
      title: 'ダークモード対応',
      description:
        'ライト／ダークの両テーマを semantic token で定義。OS 設定への追従も、手動切り替えも、追加実装なしで動作します。',
    },
    {
      title: 'コピー＆オウン',
      description:
        'ブロックのソースはあなたのリポジトリにコピーされます。`npx shadcn add` で取り込み、自由に編集・所有できます。',
    },
    {
      title: 'TypeScript ファースト',
      description:
        '全コンポーネントが厳密に型付けされ、props の補完と型チェックが効きます。誤った API はビルド時に検出されます。',
    },
    {
      title: 'フレームワーク非依存',
      description:
        'CSS 変数として token を配布するため、React 以外のスタックでも同じブランドテーマを共有できます。',
    },
  ],
}: {
  eyebrow?: string | null;
  heading?: string | null;
  features?: { title: string; description: string }[];
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      {heading || eyebrow ? (
        <div className="mb-10 flex flex-col items-start gap-3">
          {eyebrow ? <Badge variant="outline">{eyebrow}</Badge> : null}
          {heading ? (
            <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              {heading}
            </h2>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <Card key={`${feature.title}-${i}`}>
            <CardHeader>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
