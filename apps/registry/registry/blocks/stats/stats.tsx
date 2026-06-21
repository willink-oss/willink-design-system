import { Card } from '@willink-labs/react';

/**
 * Stats — a responsive metrics row composing the @willink-labs/react Card
 * primitive. This is a copy-to-own block: edit the items, copy, and layout
 * freely; the Card styling and `--color-brand` theming come from the npm
 * packages (ADR-0020). No hooks → server component. Each metric is rendered as
 * a real <dl>/<dt>/<dd> for accessibility: <dt> is the label, <dd> the value.
 */
export function Stats({
  items = [
    { label: '導入企業数', value: '1,200+', delta: '+18% 前四半期比' },
    { label: '稼働率', value: '99.99%', delta: '+0.02pt' },
    { label: 'サポート満足度', value: '4.8 / 5', delta: '+0.3' },
  ],
}: {
  items?: { label: string; value: string; delta?: string }[];
}) {
  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="p-6">
          <dt className="text-sm text-muted">{item.label}</dt>
          {/* one <dd> per term: value + optional delta grouped together */}
          <dd className="mt-2">
            <span className="block text-3xl font-bold text-fg">{item.value}</span>
            {item.delta ? (
              <span className="mt-1 block text-sm text-success">{item.delta}</span>
            ) : null}
          </dd>
        </Card>
      ))}
    </dl>
  );
}
