# Accessibility — WCAG 2.1 AA Compliance Matrix

> Coverage as of npm lockstep 1.9.0 (React / tailwind-preset / tokens / css-tokens) + Flutter willink_theme 1.5.0 (2026-07-07). Each cell records the result of static review + automated `jest-axe` checks + manual keyboard / screen-reader smoke tests. "Pass" means the requirement is met as the component is shipped; consumer-side mis-use (missing labels, low-contrast token override, etc.) can still cause a fail.

## Success criteria audited

| Code | Name | What it means for DS |
|---|---|---|
| 1.3.1 | Info and Relationships | Semantic markup; ARIA roles/labels/states preserve meaning |
| 1.4.3 | Contrast (Minimum) | Text ≥ 4.5:1 (normal) / 3:1 (large) against background |
| 1.4.11 | Non-text Contrast | Interactive UI element borders/states ≥ 3:1 |
| 2.1.1 | Keyboard | All functionality reachable via keyboard alone |
| 2.3.3 | Animation from Interactions | `prefers-reduced-motion` collapses transitions to 0ms |
| 2.4.7 | Focus Visible | Focused element shows a visible focus indicator |
| 2.5.5 | Target Size (Enhanced) | Interactive targets ≥ 44×44 CSS px |
| 3.2.4 | Consistent Identification | Same component name + ARIA role across the system |
| 4.1.2 | Name, Role, Value | Each interactive element has an accessible name and a stable role |

Legend: ✅ Pass · ⚠ Partial · 🔍 Manual review required · — Not applicable

## React components (42)

| Component | 1.3.1 | 1.4.3 | 1.4.11 | 2.1.1 | 2.3.3 | 2.4.7 | 2.5.5 | 3.2.4 | 4.1.2 | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `Button` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ⚠ | ✅ | ✅ | `sm` (h-8) is 32 px — under 44 px; document as a Form / inline action affordance, not a primary touch target. `variant="link"` resting fg is the flipping `text-brand-soft-fg` (light 7.10:1 / dark 10.93:1 on `bg`), not the mode-invariant `text-brand` which failed AA in dark (3.54:1) — fixed 1.6.0, [ADR-0017](../adr/0017-dark-link-contrast-and-info-fg.md) / #58 |
| `Badge` | ✅ | ✅ | — | — | — | — | — | ✅ | ✅ | Non-interactive |
| `Input` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | `aria-invalid` for error styling |
| `Textarea` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | Same as Input |
| `Label` | ✅ | ✅ | — | — | — | — | — | ✅ | ✅ | Pairs via `htmlFor` / Radix Label |
| `Card` | ✅ | ✅ | — | — | — | — | — | ✅ | ✅ | Non-interactive container |
| `Accordion` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Chevron rotation + content expand both honor `motion-reduce` (0.13.0); trigger hover fg is the flipping `text-brand-hover` (dark 4.76:1 on `bg`), not the mode-invariant `text-brand` (3.54:1 dark) — fixed 1.6.0, [ADR-0017](../adr/0017-dark-link-contrast-and-info-fg.md) / #58 |
| `Dialog` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Radix focus trap; `motion-reduce` collapses overlay + content animation (0.13.0) |
| `AlertDialog` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Same as Dialog with `role="alertdialog"` |
| `Avatar` | ✅ | ✅ | — | — | — | — | — | ✅ | ✅ | Fallback text required for screen readers |
| `Tabs` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | Radix Tabs (arrow-key nav) |
| `Tooltip` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | Triggers on focus + hover; `motion-reduce` collapses fade (0.13.0); inverted surface flips appropriately in dark (ADR-0013) |
| `Popover` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | Radix click-triggered panel (`role="dialog"`); focus + Esc/outside-dismiss managed; `motion-reduce` collapses fade; surface panel (`border`/`bg-bg`/`shadow`) flips in dark (ADR-0013). 4.1.2: content **requires a consumer `aria-label`/`aria-labelledby`** (axe `aria-dialog-name`) — documented + tested. Target size (2.5.5) rated on consumer-provided trigger/content (v1.9) |
| `ScrollArea` | ✅ | — | ✅ | ✅ | — | — | — | ✅ | ✅ | Radix styled scroll container (non-interactive chrome); thumb `bg-border` (1.4.11); native keyboard scroll preserved (2.1.1); 1.4.3/2.4.7/2.5.5 N/A to the chrome — content a11y is the consumer's (v1.9) |
| `Toast` (Sonner) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | preset.css overrides Sonner transitions under `prefers-reduced-motion` (0.13.0) |
| `DropdownMenu` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Radix DropdownMenu (full keyboard); `motion-reduce` collapses fade |
| `Select` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Radix Select; `motion-reduce` collapses fade |
| `Switch` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | Radix Switch |
| `Checkbox` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ⚠ | ✅ | ✅ | 16 px box; consumer should wrap in a 44 px-tall label for touch contexts |
| `RadioGroup` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ⚠ | ✅ | ✅ | Same as Checkbox |
| `Slider` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | Radix Slider (arrow keys + Home/End); root `aria-label` forwarded to the thumb when single-thumb (multi-thumb keeps Radix "Minimum"/"Maximum") |
| `Progress` | ✅ | ✅ | ✅ | — | — | — | — | ✅ | ✅ | Non-interactive, `role="progressbar"` with aria-valuenow |
| `Separator` | ✅ | — | — | — | — | — | — | ✅ | ✅ | Radix Separator `role="separator"` |
| `Skeleton` | ✅ | — | — | — | ✅ | — | — | ✅ | ✅ | `animate-pulse` collapsed to 0ms by the preset's `prefers-reduced-motion` block since 1.2.0 (Tailwind built-in keyframe); component also carries `motion-reduce:animate-none` per house style |
| `Sheet` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 4-side slide; `motion-reduce` collapses all eight `animate-sheet-*` utilities (0.13.0) |
| `Toggle` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ⚠ | ✅ | ✅ | `sm` size mirrors Button `sm`; document touch context |
| `FormField` | ✅ | ✅ | — | — | — | — | — | ✅ | ✅ | Compound a11y wiring (1.4.0, [ADR-0015](../adr/0015-formfield-api.md)): generated ids, label `htmlFor`, merged `aria-describedby` (description + error, rendered nodes only), auto `aria-invalid`; error message is `role="alert"`. Interactive criteria are rated on the slotted control itself |
| `Spinner` | ✅ | — | — | — | ✅ | — | — | ✅ | ✅ | Non-interactive `role="status"` with a default `aria-label="読み込み中"` (overridable) carrying the accessible name; the spinning ring is decorative. `animate-spin` honors `motion-reduce:animate-none` (ADR-0008) + the preset's `prefers-reduced-motion` block. 1.4.3/1.4.11 N/A (decorative ring) |
| `Empty` | ✅ | — | — | — | — | — | — | ✅ | ✅ | Presentational container; no role (non-interactive). Centered column, muted `text-fg-secondary`; title/description/action contrast is consumer-composed. axe clean |
| `Kbd` | ✅ | ✅ | — | — | — | — | — | ✅ | ✅ | Non-interactive inline `<kbd>` key-cap; `text-fg` on `bg-surface-subtle` (1.4.3); presentational — interactive / motion / target-size criteria N/A |
| `ButtonGroup` | ✅ | — | — | 🔍 | — | ✅ | — | ✅ | ✅ | `role="group"` container joining `Button` children (which carry their own a11y + focus-visible); author `aria-label` when the grouping needs a name. No own color tokens — contrast inherited from `Button` |
| `Alert` | ✅ | ✅ | ✅ | — | — | — | — | ✅ | ✅ | `role="alert"` (assertive live region) by default, overridable to `role="status"` (polite). Color variants pair semantic bg/text/border tokens for contrast; consumers supply title/description as children |
| `Table` | ✅ | ✅ | — | — | — | — | — | ✅ | ✅ | Non-interactive static table; native `<table>`/`<thead>`/`<tbody>`/`<tr>`/`<th>`/`<td>`/`<caption>` semantics supply structure (1.3.1) — no ARIA. `TableHead` `text-fg-secondary` / `TableCell` `text-fg` on `bg` (1.4.3); `hover:bg-surface-subtle` is a decorative row affordance. Interactive / motion / target-size N/A |
| `Pagination` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ⚠ | ✅ | ✅ | `nav[aria-label="pagination"]` landmark; active page is the `outline` `buttonVariants` carrying `aria-current="page"` (inactive = `ghost`); prev/next carry `aria-label`, ellipsis is `aria-hidden` + `sr-only`. Focus-visible ring via `buttonVariants` (2.4.7); page cells square the `sm` button (h-8 = 32 px) → 2.5.5 ⚠ same caveat as `Button` |
| `Breadcrumb` | ✅ | ✅ | — | ✅ | — | 🔍 | — | ✅ | ✅ | `nav[aria-label="breadcrumb"]` over `<ol>`; current page `role="link"` + `aria-current="page"` + `aria-disabled`; separators `aria-hidden`. Ancestor links keyboard-accessible (2.1.1); focus-visible rated on consumer link styling (2.4.7 🔍). `text-muted` links (~4.76:1) / `hover:text-fg`. axe clean |
| `ContextMenu` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Radix `@radix-ui/react-context-menu` (near-clone of DropdownMenu); `role="menu"` + full keyboard nav (incl. Shift+F10); `motion-reduce` collapses content fade (ADR-0008). Right-click trigger — provide a keyboard/touch alternative entry point where needed |
| `HoverCard` | ✅ | ✅ | — | ✅ | ✅ | — | — | — | ✅ | Radix `@radix-ui/react-hover-card`; opens on hover AND focus (keyboard 2.1.1); NOT `role="dialog"` so no required aria-label; `motion-reduce` collapses fade (2.3.3); supplementary preview content |
| `Collapsible` | ✅ | — | — | ✅ | — | — | — | ✅ | ✅ | Radix disclosure (`Collapsible`/`Trigger`/`Content`); trigger is a keyboard-accessible button (2.1.1) with auto `aria-expanded`/`aria-controls` (1.3.1/4.1.2). No animation by design (no preset collapsible keyframes) → 2.3.3 N/A. Content styling/contrast is consumer-composed. axe clean (open) |
| `ToggleGroup` | ✅ | ✅ | ✅ | ✅ | — | ✅ | ⚠ | ✅ | ✅ | Radix `@radix-ui/react-toggle-group`; reuses `toggleVariants` (variant/size via context). Roles per Radix: `type="single"`→radiogroup/radio, `multiple`→toolbar/button. Keyboard nav + focus-visible ring (2.1.1/2.4.7); `sm` size 32 px → 2.5.5 ⚠ (same caveat as Toggle/Button). `data-[state=on]` uses safelisted brand tokens (1.4.3/1.4.11). axe clean |
| `Command` | ✅ | ✅ | — | ✅ | — | ✅ | — | ✅ | ✅ | cmdk palette (`Command` / `CommandInput` / `CommandList` / `CommandEmpty` / `CommandGroup` / `CommandItem` / `CommandSeparator` / `CommandShortcut`). cmdk supplies combobox/listbox semantics: typeahead-filtered `cmdk-item`s, `aria-selected` highlight via `data-[selected=true]:bg-surface-subtle`, full keyboard nav (↑/↓/Enter, 2.1.1) with focus on the search input (2.4.7). `text-fg` items / `text-fg-secondary` empty state / `text-muted` headings on `bg` (1.4.3). No animation by design → 2.3.3 N/A; 1.4.11/2.5.5 rated on the consumer-composed list rows. axe clean (open) |
| `NavigationMenu` | ✅ | ✅ | — | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | Radix `@radix-ui/react-navigation-menu` (`NavigationMenu` / `List` / `Item` / `Trigger` / `Content` / `Link` / `Viewport` / `Indicator`). Renders a `<nav>` landmark; Radix wires `aria-expanded` on triggers + disclosure semantics (1.3.1/4.1.2). Full keyboard nav (arrows / Enter / Esc, 2.1.1) with a focus-visible ring on the `navigationMenuTriggerStyle` pill (2.4.7). Trigger / panel use `text-fg` on `bg` + `border-border` surface (1.4.3); `data-[state=open]:bg-surface-subtle` + the `ChevronDown` `rotate-180` are decorative state cues. `motion-reduce:animate-none` collapses the panel/viewport fade (2.3.3). `h-10` (40 px) pill trigger → 2.5.5 ⚠ (same inline-nav caveat as Button/Tabs). axe clean (open) |
| `Menubar` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠ | ✅ | ✅ | Radix `@radix-ui/react-menubar` (near-clone of `ContextMenu`; `Menubar` / `MenubarMenu` / `MenubarTrigger` / `MenubarContent` / `MenubarItem` / `MenubarCheckboxItem` / `MenubarRadioItem` / `MenubarSub*` / `MenubarSeparator` / `MenubarShortcut`). The `Menubar` root is a `flex h-10` bar of `role="menuitem"` triggers; Radix wires `aria-expanded` + each menu's `role="menu"` (1.3.1/4.1.2). Full keyboard nav (arrows between menus / Enter / Esc, 2.1.1) with a focus-visible `data-[state=open]:bg-surface-subtle` cue on triggers (2.4.7). `text-fg`/`text-muted` on `bg` + `border-border` surface (1.4.3); `MenubarContent`/`MenubarSubContent` `motion-reduce:animate-none` collapses the panel fade (2.3.3, ADR-0008). `py-1.5` trigger row → 2.5.5 ⚠ (same inline menu-bar caveat as NavigationMenu). axe clean (open) |

## Flutter components (9, willink_theme 1.5.0)

| Component | 1.3.1 | 1.4.3 | 1.4.11 | 2.1.1 | 2.4.7 | 4.1.2 | Notes |
|---|---|---|---|---|---|---|---|
| `WillinkButton` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Material 3 Button semantics; `Semantics(button: true)` |
| `WillinkEmptyState` | ✅ | ✅ | — | — | — | ✅ | Static layout; CTA inherits Button a11y |
| `WillinkErrorState` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Retry button inherits WillinkButton; copy button has aria label |
| `WillinkLoadingState` | ✅ | ✅ | — | — | — | ✅ | `Semantics(label: 'Loading')` |
| `WillinkSectionCard` | ✅ | ✅ | — | — | — | ✅ | Non-interactive container |
| `WillinkTabBar` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Thin wrapper over Material 3 `TabBar`; inherits tablist/tab roles + arrow-key nav + focus ring. Selected label/indicator `colorScheme.primary`, unselected `onSurfaceVariant`, divider `outlineVariant` |
| `WillinkBottomSheet` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `showModalBottomSheet` wrapper; modal route traps focus + scrim/Esc dismiss. Surface `colorScheme.surface`, drag handle `outlineVariant` |
| `WillinkSnackBar` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `ScaffoldMessenger.showSnackBar` wrapper; inherits SnackBar live-region announce + queueing. Optional `SnackBarAction` in `primary` (keyboard-reachable, focus-visible); variant accent via leading icon, message text carries the meaning non-visually |
| `WillinkProgressIndicator` | ✅ | — | ✅ | — | — | ✅ | `LinearProgressIndicator` wrapper with `semanticsLabel` passthrough (progressbar role + value). Non-interactive, no text. Fill `primary` / track `surfaceContainerHighest` (non-text contrast) |

Note: Flutter's `prefers-reduced-motion` honors the OS-level toggle automatically for `AnimatedContainer` / `Hero` etc. when the platform setting is on. DS components rely on Material 3 defaults and do not introduce custom keyframes.

## Notes for adopters

- The matrix audits the **DS surface**. Consumer-side mistakes that the DS cannot prevent — for example, putting a low-contrast color on `--color-brand`, omitting `<Label>` for `<Input>`, or wrapping interactive elements in non-semantic `<div>` — will still fail audits.
- Target Size (2.5.5) is rated `⚠` for `sm` size variants (Button / Toggle / Checkbox / RadioGroup). These exist for inline-form contexts. Consumer should choose `md` (default) or larger for primary touch surfaces, or wrap small controls in a 44 px-tall hit area (e.g. label + padding).
- Motion (2.3.3) is honored at two layers from 0.13.0: Tailwind `motion-reduce:animate-none` variants on each component, and a `prefers-reduced-motion` CSS block in `@willink-labs/tailwind-preset` that collapses every `animate-*` utility (plus Sonner toast transitions) to 0 ms. See [`motion-contract.md`](./motion-contract.md).
- `Skeleton` `animate-pulse` — the last uncovered DS animation — joined the preset's `prefers-reduced-motion` block in 1.2.0 (it is a Tailwind built-in keyframe, so the CSS safety net does the heavy lifting); the component additionally carries the `motion-reduce:animate-none` variant, matching the rest of the system.
- **Text emphasis ladder (1.5.0+ / [ADR-0016](../adr/0016-text-emphasis-roles.md)).** The five `fg-*` roles (`text-fg-strong` / `-emphasis` / `-secondary` / `-subtle` / `-faint`) carry per-role contrast contracts on `bg`, enforced by `scripts/check-contrast.mjs` in both modes: `fg-strong` / `fg-emphasis` ≥ 7:1 (AAA), `fg-secondary` ≥ 4.5:1 (AA body). `fg-subtle` (light 2.56:1 / dark 4.24:1) and `fg-faint` (light 1.48:1 / dark 2.66:1) are **below the 4.5:1 body-text floor by design** — like `muted` on white, they are documented report-only baselines for non-body use: `fg-subtle` for captions / meta / placeholders, `fg-faint` for disabled text / separators. Adopters must not use them for content text; the contrast gate prints them with ⚠ so the floor is a visible number, not folklore.
- **Gradient & accent text in dark mode (1.7.0+ / [ADR-0018](../adr/0018-gradient-accent-text-dark.md)).** The `text-gradient-primary` `bg-clip-text` heading now uses **dark-aware endpoints** (light byte-identical; dark `brand-300` → `brand-400`, worst endpoint 7.41:1 on `bg`, up from the washed-out 3.54:1 it rendered at the fixed brand primitives). `scripts/check-contrast.mjs` gained a `TEXT_GRADIENTS` gate that checks every text-clipped gradient's **worst endpoint** against `bg` — required ≥ 4.5 in dark, report-only baseline in light — closing the `bg-clip-text` audit blind spot the production sweeps caught twice. Accent text placed on gradient *backgrounds* is a consumer composition the DS cannot enumerate; the contract (hue/lightness separation, both modes) is in [docs/a11y/gradient-and-accent.md](./gradient-and-accent.md). Vivid `bg-gradient-*` panels behind white text are not text and are intentionally excluded.
