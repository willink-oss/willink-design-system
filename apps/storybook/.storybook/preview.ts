import type { Preview } from "@storybook/react-vite";

import "./preview.css";

const preview: Preview = {
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
