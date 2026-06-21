'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ToggleGroup,
  ToggleGroupItem,
} from '@willink-labs/react';

/**
 * ComparisonTable — a tiered pricing / feature comparison matrix composing the
 * @willink-labs/react primitives (ToggleGroup + Table + HoverCard + Badge +
 * Button). Companion to the `pricing-card` block: where pricing-card shows one
 * tier, this lays every tier side by side so a buyer can scan feature-by-feature.
 *
 * This is a copy-to-own block (ADR-0020): the plans, features, copy, and layout
 * are yours to edit, while the primitive styling and `--color-brand` theming come
 * from the npm packages — a consumer's single `--color-brand` override re-themes
 * the whole matrix.
 *
 * The billing-period ToggleGroup (月額 / 年額) is local useState, so this is a
 * client component; flipping it swaps every plan's displayed price. Each feature
 * row's name can carry a `hint`, rendered in a HoverCard explainer popover. Per
 * cell, a boolean renders an accessible ✓ / ✗ (with sr-only 対応 / 非対応 text),
 * and a string renders verbatim. The footer row repeats a CTA Button per plan,
 * wired via the optional `onSelectPlan` callback (or override the per-plan `cta`).
 */

export type ComparisonPlan = {
  name: string;
  price: { monthly: string; annual: string };
  /** CTA label for this plan's footer button. */
  cta?: string;
  /** Emphasise this column and show a 人気 badge. */
  highlighted?: boolean;
};

export type ComparisonFeature = {
  name: string;
  /** Optional explainer shown in a HoverCard popover on the feature name. */
  hint?: string;
  /**
   * One value per plan, aligned to the `plans` array order. `true`/`false`
   * render an accessible ✓ / ✗; a string renders verbatim (e.g. "10 GB").
   */
  values: (boolean | string)[];
};

type BillingPeriod = 'monthly' | 'annual';

const DEFAULT_PLANS: ComparisonPlan[] = [
  { name: 'Free', price: { monthly: '¥0', annual: '¥0' }, cta: '無料で始める' },
  {
    name: 'Pro',
    price: { monthly: '¥2,980', annual: '¥29,800' },
    cta: 'Pro を選ぶ',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: '要相談', annual: '要相談' },
    cta: '営業に問い合わせ',
  },
];

const DEFAULT_FEATURES: ComparisonFeature[] = [
  {
    name: 'プロジェクト数',
    hint: '同時に作成・管理できるプロジェクトの上限です。',
    values: ['3', '無制限', '無制限'],
  },
  {
    name: 'ストレージ',
    hint: 'アップロードしたファイルとアセットの合計容量です。',
    values: ['1 GB', '100 GB', 'カスタム'],
  },
  {
    name: '優先サポート',
    hint: '営業時間内に優先対応するサポート窓口です。',
    values: [false, true, true],
  },
  {
    name: 'SSO / SAML 連携',
    hint: 'IdP と連携したシングルサインオンに対応します。',
    values: [false, false, true],
  },
  {
    name: '監査ログ',
    values: [false, true, true],
  },
];

/** Accessible ✓ / ✗ for boolean cells; string values render verbatim. */
function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'string') {
    return <span className="text-fg">{value}</span>;
  }
  if (value) {
    return (
      <span className="text-success">
        <span aria-hidden="true">✓</span>
        <span className="sr-only">対応</span>
      </span>
    );
  }
  return (
    <span className="text-muted">
      <span aria-hidden="true">✗</span>
      <span className="sr-only">非対応</span>
    </span>
  );
}

export function ComparisonTable({
  plans = DEFAULT_PLANS,
  features = DEFAULT_FEATURES,
  defaultPeriod = 'monthly',
  caption = '料金は税抜です。年額プランは月額換算で約 2 ヶ月分お得になります。',
  onSelectPlan,
}: {
  plans?: ComparisonPlan[];
  features?: ComparisonFeature[];
  defaultPeriod?: BillingPeriod;
  caption?: string;
  /** Wire each plan's CTA; without it the footer buttons are inert. */
  onSelectPlan?: (plan: ComparisonPlan, period: BillingPeriod) => void;
}) {
  const [period, setPeriod] = useState<BillingPeriod>(defaultPeriod);

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center sm:justify-end">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={period}
          // Radix single-select emits "" on deselect; keep a period always active.
          onValueChange={(value) => {
            if (value) setPeriod(value as BillingPeriod);
          }}
          aria-label="請求サイクル"
        >
          <ToggleGroupItem value="monthly" aria-label="月額で表示">
            月額
          </ToggleGroupItem>
          <ToggleGroupItem value="annual" aria-label="年額で表示">
            年額
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="align-bottom">
              機能
            </TableHead>
            {plans.map((plan) => (
              <TableHead
                key={plan.name}
                scope="col"
                className={
                  plan.highlighted
                    ? 'text-center align-bottom text-brand'
                    : 'text-center align-bottom'
                }
              >
                <span className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-fg">{plan.name}</span>
                    {plan.highlighted ? <Badge>人気</Badge> : null}
                  </span>
                  <span className="text-lg font-bold text-fg">
                    {period === 'monthly' ? plan.price.monthly : plan.price.annual}
                    <span className="ml-0.5 text-xs font-normal text-muted">
                      / {period === 'monthly' ? '月' : '年'}
                    </span>
                  </span>
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.name}>
              <TableHead
                scope="row"
                className="font-medium text-fg whitespace-normal"
              >
                {feature.hint ? (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-left underline decoration-dotted underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                      >
                        {feature.name}
                        <span aria-hidden="true" className="text-muted">
                          ⓘ
                        </span>
                        <span className="sr-only">の説明</span>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent align="start" className="w-72">
                      <p className="text-sm font-semibold text-fg">{feature.name}</p>
                      <p className="mt-1 text-sm text-muted">{feature.hint}</p>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  feature.name
                )}
              </TableHead>
              {plans.map((plan, planIndex) => (
                <TableCell
                  key={plan.name}
                  className={
                    plan.highlighted
                      ? 'text-center bg-surface-subtle'
                      : 'text-center'
                  }
                >
                  <CellValue value={feature.values[planIndex] ?? false} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        <tfoot>
          <TableRow className="hover:bg-transparent">
            <TableCell className="align-top" />
            {plans.map((plan) => (
              <TableCell key={plan.name} className="p-3 text-center align-top">
                <Button
                  className="w-full"
                  size="sm"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => onSelectPlan?.(plan, period)}
                >
                  {plan.cta ?? `${plan.name} を選ぶ`}
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </tfoot>
      </Table>
    </div>
  );
}
