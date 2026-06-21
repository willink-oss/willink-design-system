import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ScrollArea,
  ScrollBar,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@willink-labs/react';

/**
 * LogoCloud — a "導入企業 / trusted by" social-proof logo strip composing the
 * @willink-labs/react primitives (ScrollArea + Avatar + Tooltip + Skeleton).
 * This is a copy-to-own block: edit the heading and logos freely; the primitive
 * styling and `--color-brand` theming come from the npm packages — a consumer's
 * single `--color-brand` override re-themes it (ADR-0020). No icons
 * (dependency-free) and no block-level hooks (`loading` is a prop; ScrollArea /
 * Tooltip / Skeleton are self-contained) → server component.
 *
 * Renders an optional small heading, then a horizontally-scrollable ScrollArea
 * (with an explicit horizontal ScrollBar) containing a flex row of logo items.
 * Each logo is an Avatar — greyscaled, dimmed image (or initials fallback when
 * no `src`) — wrapped in a focusable Tooltip trigger whose TooltipContent shows
 * the company name. All tooltips share a single TooltipProvider. When
 * `loading`, ~6 rounded Skeleton placeholders sized like the logos render
 * instead of the real logos.
 *
 * a11y: the strip is a labelled <section> (aria-labelledby the heading, or a
 * fallback aria-label); each logo lives in a real <button> Tooltip trigger so
 * it is keyboard-focusable with the company name as its accessible name (the
 * AvatarImage's `alt` is decorative there, so it is emptied to avoid a doubled
 * name); the greyscale/opacity styling is purely cosmetic.
 */
export function LogoCloud({
  heading = '導入企業',
  logos = [
    { name: '株式会社さくらインターネット', fallback: 'さくら' },
    { name: 'みらいテクノロジー株式会社', fallback: 'みらい' },
    { name: '日本クラウド工業株式会社', fallback: '日ク' },
    { name: 'ひかりソフトウェア株式会社', fallback: 'ひかり' },
    { name: 'あおぞらネットワークス株式会社', fallback: 'あおぞら' },
    { name: 'やまと商事株式会社', fallback: 'やまと' },
    { name: 'つばさデータ株式会社', fallback: 'つばさ' },
    { name: 'こもれびデザイン株式会社', fallback: 'こもれび' },
  ],
  loading = false,
}: {
  heading?: string | null;
  logos?: { name: string; src?: string; fallback: string }[];
  loading?: boolean;
}) {
  const headingId = 'logo-cloud-heading';

  return (
    <section
      className="mx-auto w-full max-w-5xl px-6 py-12"
      aria-labelledby={heading ? headingId : undefined}
      aria-label={heading ? undefined : '導入企業'}
    >
      {heading ? (
        <h2
          id={headingId}
          className="mb-6 text-center text-sm font-medium uppercase tracking-wide text-muted"
        >
          {heading}
        </h2>
      ) : null}

      <ScrollArea className="w-full whitespace-nowrap">
        {loading ? (
          <div className="flex items-center gap-8 pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="circle"
                className="h-12 w-12 shrink-0"
              />
            ))}
          </div>
        ) : (
          <TooltipProvider>
            <ul className="flex items-center gap-8 pb-4">
              {logos.map((logo, i) => (
                <li key={`${logo.name}-${i}`} className="shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* Real <button> → keyboard-focusable; the company name is
                          its accessible name. The greyscale/opacity is cosmetic. */}
                      <button
                        type="button"
                        aria-label={logo.name}
                        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                      >
                        <Avatar className="h-12 w-12 transition hover:opacity-100">
                          {logo.src ? (
                            <AvatarImage
                              src={logo.src}
                              alt=""
                              className="grayscale opacity-70"
                            />
                          ) : null}
                          <AvatarFallback className="text-xs opacity-70">
                            {logo.fallback}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{logo.name}</TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </TooltipProvider>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
