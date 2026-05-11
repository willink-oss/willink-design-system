import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { RadioGroup, RadioGroupItem } from "./radio-group";

function Sample({ defaultValue }: { defaultValue?: string }) {
  return (
    <RadioGroup defaultValue={defaultValue} aria-label="plan">
      <RadioGroupItem value="standard" aria-label="Standard" />
      <RadioGroupItem value="premium" aria-label="Premium" />
      <RadioGroupItem value="enterprise" aria-label="Enterprise" />
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("renders all items as radio role", () => {
    render(<Sample />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
  });

  it("respects defaultValue", () => {
    render(<Sample defaultValue="premium" />);
    expect(screen.getByRole("radio", { name: /Premium/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: /Standard/ })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("clicking an item selects it (others deselect)", async () => {
    const user = userEvent.setup();
    render(<Sample defaultValue="standard" />);
    await user.click(screen.getByRole("radio", { name: /Premium/ }));
    expect(screen.getByRole("radio", { name: /Premium/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: /Standard/ })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("supports keyboard navigation (Arrow keys)", async () => {
    const user = userEvent.setup();
    render(<Sample defaultValue="standard" />);
    const std = screen.getByRole("radio", { name: /Standard/ });
    std.focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(
      screen.getByRole("radio", { name: /Premium/ }),
    );
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Sample defaultValue="standard" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
