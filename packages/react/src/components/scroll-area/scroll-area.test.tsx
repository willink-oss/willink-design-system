import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { ScrollArea } from "./scroll-area";

function Sample() {
  return (
    <main>
      <ScrollArea className="h-24 w-48 rounded-md border">
        <div>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>Row {i + 1}</p>
          ))}
        </div>
      </ScrollArea>
    </main>
  );
}

describe("ScrollArea", () => {
  it("renders its content inside the viewport", () => {
    render(<Sample />);
    expect(screen.getByText("Row 1")).toBeInTheDocument();
    expect(screen.getByText("Row 20")).toBeInTheDocument();
  });

  it("applies custom className to the root", () => {
    const { container } = render(<Sample />);
    expect(container.querySelector(".h-24")).toBeInTheDocument();
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
