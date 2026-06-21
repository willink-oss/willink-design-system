'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@willink-labs/react';

/**
 * Faq — a frequently-asked-questions section composing the @willink-labs/react
 * Accordion primitive (single-open, collapsible). This is a copy-to-own block:
 * edit the heading and Q&A copy freely; the Accordion styling and
 * `--color-brand` theming come from the npm packages — a consumer's single
 * `--color-brand` override re-themes it (ADR-0020).
 */
export function Faq({
  heading = 'よくある質問',
  items = [
    {
      question: '導入にエンジニアは必要ですか？',
      answer:
        '基本的な設定は管理画面から数分で完了します。API 連携など高度なカスタマイズを行う場合のみ、エンジニアのサポートを推奨しています。',
    },
    {
      question: '無料プランから有料プランへの移行はいつでもできますか？',
      answer:
        'はい。管理画面からいつでもアップグレードでき、日割りで請求されます。ダウングレードも次回更新日から反映されます。',
    },
    {
      question: 'ブランドカラーは変更できますか？',
      answer:
        '`--color-brand` を 1 行上書きするだけで、ボタン・バッジ・リンクなど全コンポーネントの配色が一括で切り替わります。',
    },
    {
      question: 'サポート体制について教えてください。',
      answer:
        'すべてのプランでメールサポートをご利用いただけます。Pro プラン以上では優先サポートと専任担当者がつきます。',
    },
  ],
}: {
  heading?: string | null;
  items?: { question: string; answer: string }[];
}) {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-16">
      {heading ? (
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
          {heading}
        </h2>
      ) : null}

      <Accordion type="single" collapsible>
        {items.map((item, i) => (
          <AccordionItem key={`item-${i}`} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
