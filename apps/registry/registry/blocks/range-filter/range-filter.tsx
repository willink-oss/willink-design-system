'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@willink-labs/react';

/**
 * RangeFilter — a faceted price/number range filter in a Popover, composing the
 * @willink-labs/react primitives (Popover + Slider + Badge + Button + Label).
 *
 * The trigger is an outline Button showing the facet label plus a Badge with the
 * current formatted range; opening it reveals a two-thumb Slider bound to local
 * useState, the live formatted bounds, and a リセット / 適用 footer. 適用 fires
 * `onApply` with the chosen `[min, max]` tuple and closes the panel; リセット
 * restores `defaultValue`. The committed range is held separately from the draft
 * so dismissing without 適用 leaves the trigger Badge unchanged.
 *
 * Copy-to-own via `npx shadcn add @willink/range-filter` — the facet wiring and
 * formatting are yours to edit, while the primitives and `--color-brand` theming
 * come from the npm packages (ADR-0020).
 *
 * a11y: the DS Slider renders two Radix thumbs that Radix auto-labels
 * "Minimum"/"Maximum"; a group `aria-labelledby` on the Slider root references the panel Label
 * for screen readers. The trigger Button's accessible name combines the facet
 * label and the formatted range; both footer Buttons are text-labelled.
 */

/** Default JPY currency formatter, e.g. `12,000円`. */
const defaultFormat = (n: number) => `${n.toLocaleString()}円`;

export type RangeFilterProps = {
  /** Facet name shown on the trigger and as the panel heading, e.g. '価格帯'. */
  label?: string;
  /** Lower bound of the slider. */
  min?: number;
  /** Upper bound of the slider. */
  max?: number;
  /** Step granularity of the slider. */
  step?: number;
  /** Initial committed range; also the target of リセット. */
  defaultValue?: [number, number];
  /** Formats a bound for display (trigger Badge + panel readout). */
  format?: (n: number) => string;
  /** Called with the committed `[min, max]` when 適用 is pressed. */
  onApply?: (range: [number, number]) => void;
};

export function RangeFilter({
  label = '価格帯',
  min = 0,
  max = 100000,
  step = 1000,
  defaultValue,
  format = defaultFormat,
  onApply,
}: RangeFilterProps) {
  const initial: [number, number] = defaultValue ?? [min, max];

  // `committed` drives the trigger Badge; `draft` is the in-panel slider value.
  // Dismissing without 適用 discards `draft`, so the trigger stays in sync with
  // the last applied range.
  const [open, setOpen] = useState(false);
  const [committed, setCommitted] = useState<[number, number]>(initial);
  const [draft, setDraft] = useState<[number, number]>(initial);

  const committedSummary = `${format(committed[0])} – ${format(committed[1])}`;

  // When the panel opens, seed the draft from the committed range so the slider
  // reflects the active filter.
  function handleOpenChange(next: boolean) {
    if (next) setDraft(committed);
    setOpen(next);
  }

  function handleReset() {
    setDraft(initial);
  }

  function handleApply() {
    setCommitted(draft);
    onApply?.(draft);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`${label}: ${committedSummary}`}
        >
          <span>{label}</span>
          <Badge variant="default" aria-hidden="true">
            {committedSummary}
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent aria-label={`${label}の絞り込み`} className="w-80">
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label id="range-filter-label" className="text-sm">
              {label}
            </Label>
            <p className="text-sm text-muted">
              {format(draft[0])} 〜 {format(draft[1])}
            </p>
          </div>

          <Slider
            aria-labelledby="range-filter-label"
            min={min}
            max={max}
            step={step}
            value={draft}
            onValueChange={([low, high]) =>
              setDraft([low ?? min, high ?? max])
            }
            className="py-2"
          />

          <dl className="flex items-center justify-between text-sm">
            <div className="grid gap-0.5">
              <dt className="text-muted">最小</dt>
              <dd className="font-semibold text-fg">{format(draft[0])}</dd>
            </div>
            <div className="grid gap-0.5 text-right">
              <dt className="text-muted">最大</dt>
              <dd className="font-semibold text-fg">{format(draft[1])}</dd>
            </div>
          </dl>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleReset}
            >
              リセット
            </Button>
            <Button size="sm" type="button" onClick={handleApply}>
              適用
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
