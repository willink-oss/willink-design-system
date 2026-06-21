import { Fragment } from 'react';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@willink-labs/react';

/**
 * DescriptionList — a metadata / settings-summary readout composing the
 * @willink-labs/react primitives (Card + Separator + Badge + Tooltip +
 * Collapsible). Renders a real <dl> of term/description rows for config
 * summaries, account details, or any key/value readout — each row is a <dt>
 * (the label) and a <dd> (the value, optionally tagged with a Badge), with
 * Separators dividing rows.
 *
 * This is a copy-to-own block (ADR-0020): the items, labels, and layout are
 * yours to edit, while the primitive styling and `--color-brand` theming come
 * from the npm packages — a consumer's single `--color-brand` override
 * re-themes the whole card.
 *
 * No block-level state: a term's optional `hint` renders in an uncontrolled
 * Radix Tooltip, and the optional `details` section is an uncontrolled
 * Collapsible (a "詳細を表示" trigger toggling extra content). Both are
 * self-contained Radix → this is a server component.
 *
 * a11y: <dl>/<dt>/<dd> give the list native description-list semantics; the
 * Tooltip trigger is a focusable, named <button>; the Collapsible trigger is a
 * real <button> (Radix wires aria-expanded / aria-controls); the ⓘ glyph is
 * decorative (aria-hidden) and the Badge text is always visible.
 */

export type DescriptionListItem = {
  /** The label (rendered as <dt>). */
  term: string;
  /** The value (rendered as <dd>). */
  description: string;
  /** Optional explainer shown in a Tooltip on the term. */
  hint?: string;
  /** Optional short tag rendered as a Badge next to the description. */
  badge?: string;
};

const DEFAULT_ITEMS: DescriptionListItem[] = [
  {
    term: 'プラン',
    description: 'Pro（年額）',
    hint: '請求サイクルと利用できる機能はプランによって異なります。',
    badge: '有効',
  },
  {
    term: 'メンバー数',
    description: '12 / 25 席',
    hint: '現在の利用席数と契約上限です。上限は管理画面から変更できます。',
  },
  {
    term: 'ストレージ',
    description: '48.2 GB / 100 GB',
  },
  {
    term: '次回請求日',
    description: '2026 年 7 月 1 日',
    badge: '自動更新',
  },
  {
    term: 'リージョン',
    description: '東京（ap-northeast-1）',
    hint: 'データが保存・処理される物理リージョンです。',
  },
];

export function DescriptionList({
  heading = 'ワークスペース概要',
  items = DEFAULT_ITEMS,
  details = {
    summary: '詳細を表示',
    content:
      'このワークスペースは 2024 年 4 月に作成され、SSO（SAML）と監査ログが有効化されています。設定の変更はオーナー権限を持つメンバーのみが行えます。',
  },
}: {
  heading?: string | null;
  items?: DescriptionListItem[];
  /** Optional expandable extra-details section at the bottom (Collapsible). */
  details?: { summary: string; content: string } | null;
}) {
  return (
    <TooltipProvider>
      <Card className="w-full max-w-md">
        {heading ? (
          <CardHeader>
            <CardTitle className="text-lg">{heading}</CardTitle>
          </CardHeader>
        ) : null}

        <CardContent className={heading ? undefined : 'pt-6'}>
          <dl className="text-sm">
            {items.map((item, index) => (
              <Fragment key={`${item.term}-${index}`}>
                {index > 0 ? <Separator className="my-3" /> : null}
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="shrink-0 font-medium text-muted">
                    {item.hint ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-sm text-left underline decoration-dotted underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                          >
                            {item.term}
                            <span aria-hidden="true" className="text-muted">
                              ⓘ
                            </span>
                            <span className="sr-only">の説明</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          {item.hint}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      item.term
                    )}
                  </dt>
                  <dd className="flex min-w-0 items-center justify-end gap-2 text-right font-medium text-fg">
                    <span className="truncate">{item.description}</span>
                    {item.badge ? (
                      <Badge variant="outline" className="shrink-0">
                        {item.badge}
                      </Badge>
                    ) : null}
                  </dd>
                </div>
              </Fragment>
            ))}
          </dl>

          {details ? (
            <Collapsible className="mt-4">
              <Separator className="mb-3" />
              <CollapsibleTrigger className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg">
                {details.summary}
                <span aria-hidden="true">▾</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 text-muted">
                {details.content}
              </CollapsibleContent>
            </Collapsible>
          ) : null}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
