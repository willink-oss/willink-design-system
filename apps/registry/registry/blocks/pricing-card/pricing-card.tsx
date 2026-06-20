import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@willink-labs/react';

/**
 * PricingCard — a single pricing tier composing the @willink-labs/react
 * primitives (Card + Badge + Button). This is a copy-to-own block: edit the
 * copy, features, and layout freely; the primitive styling and `--color-brand`
 * theming come from the npm packages (ADR-0020). Render several side by side
 * for a full pricing table.
 */
export function PricingCard({
  plan = 'Pro',
  price = '¥2,980',
  period = '/ 月',
  description = 'チームで本格的に使うための全機能プラン。',
  features = ['無制限プロジェクト', '優先サポート', 'SSO / SAML 連携', '監査ログ'],
  highlighted = false,
  action = { label: 'このプランを選ぶ', href: '#' },
}: {
  plan?: string;
  price?: string;
  period?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  action?: { label: string; href: string };
}) {
  return (
    <Card className={highlighted ? 'flex w-full max-w-sm flex-col border-brand' : 'flex w-full max-w-sm flex-col'}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{plan}</CardTitle>
          {highlighted ? <Badge>人気</Badge> : null}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-fg">{price}</span>
          <span className="text-sm text-muted">{period}</span>
        </p>
        <ul className="flex flex-col gap-2 text-sm text-fg">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span aria-hidden className="text-brand">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" variant={highlighted ? 'default' : 'outline'}>
          <a href={action.href}>{action.label}</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
