import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

function Sample({
  defaultValue,
  onValueChange,
}: {
  defaultValue?: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger aria-label="Choose plan">
        <SelectValue placeholder="Choose..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="standard">Standard</SelectItem>
        <SelectItem value="premium">Premium</SelectItem>
        <SelectItem value="enterprise">Enterprise</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders combobox trigger", () => {
    render(<Sample />);
    expect(screen.getByRole("combobox", { name: /Choose plan/ })).toBeInTheDocument();
  });

  it("shows placeholder when no value", () => {
    render(<Sample />);
    expect(screen.getByText("Choose...")).toBeInTheDocument();
  });

  it("shows defaultValue when provided", () => {
    render(<Sample defaultValue="premium" />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });

  it("trigger reflects aria-expanded state", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const trigger = screen.getByRole("combobox", { name: /Choose plan/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
