import type { Decorator, Preview } from "@storybook/react-vite";

import "./preview.css";

/**
 * Theme decorator — rides the `data-theme` contract (docs/adr/0013-dark-mode.md).
 *
 * - "light" / "dark": sets `<html data-theme="…">`, the explicit override path.
 * - "auto": removes the attribute entirely so the preset's
 *   `prefers-color-scheme: dark` media-query path decides (OS preference).
 *
 * The preview iframe's html/body already follow `var(--color-bg)` /
 * `var(--color-fg)` (see preview.css), so the canvas flips with the tokens.
 * Hand-rolled instead of @storybook/addon-themes to keep dependencies minimal
 * (Phase 0 guardrails culture) — the contract is one attribute on <html>.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "light";
  if (theme === "auto") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
  return Story();
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "data-theme contract: light / dark / auto (ADR-0013)",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
          { value: "auto", icon: "browser", title: "Auto (OS)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  // Deterministic default: a11y addon runs (axe) must not depend on the
  // reviewer's OS color scheme. "auto" stays one click away in the toolbar.
  initialGlobals: {
    theme: "light",
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Per-component WCAG 2.1 AA status lives in docs/a11y/matrix.md — the
    // addon-a11y panel below is the live check, the matrix is the contract.
    a11y: {
      test: "error",
    },
  },
};

export default preview;
