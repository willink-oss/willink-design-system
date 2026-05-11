import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom が pointer capture API を実装していないため、Radix Select / Tooltip 等
// が pointerdown 時に呼び出す Element.hasPointerCapture / setPointerCapture /
// releasePointerCapture を polyfill (no-op で十分)。
// jsdom が pointer capture API / ResizeObserver / scrollIntoView を実装して
// いないため、Radix Select / Tooltip / Slider / Toast 等が呼び出すこれらを
// no-op で polyfill。
if (typeof Element !== "undefined") {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
