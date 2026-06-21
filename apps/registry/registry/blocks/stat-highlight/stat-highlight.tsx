import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@willink-labs/react';

/**
 * StatHighlight — a single rich KPI / metric highlight card composing the
 * @willink-labs/react primitives (Card + Progress + Badge). Complements the
 * Stats row block when one metric deserves the spotlight: a big value, a trend
 * Badge, and an optional goal-progress bar. This is a copy-to-own block: edit
 * the copy, thresholds, and layout freely; the primitive styling and
 * `--color-brand` theming come from the npm packages (ADR-0020). No hooks →
 * server component.
 *
 * a11y: the trend Badge text (e.g. '+12%') conveys direction without relying on
 * color alone, and the Radix Progress bar gets an accessible name via
 * `aria-label` so it is not announced anonymously.
 */
export function StatHighlight({
  label = '月間アクティブユーザー',
  value = '24,800',
  delta = '+12%',
  deltaTrend = 'up',
  progress = 78,
  goalLabel = '目標の 78%',
}: {
  label?: string;
  value?: string;
  delta?: string;
  deltaTrend?: 'up' | 'down' | 'neutral';
  /** 0–100; renders a goal progress bar when provided. */
  progress?: number;
  goalLabel?: string;
}) {
  // deltaTrend → Badge variant: up = success, down = danger, neutral = outline.
  const trendVariant =
    deltaTrend === 'up' ? 'success' : deltaTrend === 'down' ? 'danger' : 'outline';

  // Directional glyph reinforces the Badge text but is decorative (the '+12%'
  // text already carries the meaning), so it is hidden from assistive tech.
  const trendGlyph =
    deltaTrend === 'up' ? '↑' : deltaTrend === 'down' ? '↓' : '→';

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        {/* CardTitle is an <h3>; here it is the small metric label, not a giant
            heading, so the type scale is overridden to text-sm text-muted. */}
        <CardTitle className="text-sm font-normal text-muted">{label}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-fg">{value}</span>
          {delta ? (
            <Badge variant={trendVariant}>
              <span aria-hidden>{trendGlyph}</span>
              {delta}
            </Badge>
          ) : null}
        </div>

        {typeof progress === 'number' ? (
          <div className="flex flex-col gap-2">
            <Progress value={progress} aria-label={goalLabel || label} />
            {goalLabel ? (
              <p className="text-sm text-muted">{goalLabel}</p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
