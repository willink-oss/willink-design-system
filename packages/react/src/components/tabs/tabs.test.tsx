import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Sample({ defaultValue }: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue ?? "account"}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account content</TabsContent>
      <TabsContent value="password">Password content</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders all trigger tabs as buttons (tab role)", () => {
    render(<Sample />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("shows defaultValue content", () => {
    render(<Sample defaultValue="password" />);
    expect(screen.getByText("Password content")).toBeInTheDocument();
    expect(screen.queryByText("Account content")).not.toBeInTheDocument();
  });

  it("clicking a trigger switches content", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    expect(screen.getByText("Account content")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /Password/ }));
    expect(screen.getByText("Password content")).toBeInTheDocument();
    expect(screen.queryByText("Account content")).not.toBeInTheDocument();
  });

  it("disabled tab is not clickable", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const disabled = screen.getByRole("tab", { name: /Disabled/ });
    expect(disabled).toBeDisabled();
    await user.click(disabled);
    // Account should still be the active content
    expect(screen.getByText("Account content")).toBeInTheDocument();
  });

  it("supports keyboard navigation (ArrowRight)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    const account = screen.getByRole("tab", { name: /Account/ });
    account.focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(
      screen.getByRole("tab", { name: /Password/ }),
    );
  });

  it("has no axe a11y violations", async () => {
    const { container } = render(<Sample />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
