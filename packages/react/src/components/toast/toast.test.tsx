import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Toaster, toast } from "./toast";

function Sample() {
  return (
    <>
      <button onClick={() => toast.success("Saved")}>Save</button>
      <button onClick={() => toast.error("Failed", { description: "Try again" })}>
        Fail
      </button>
      <Toaster />
    </>
  );
}

describe("Toast", () => {
  it("renders Toaster region", () => {
    render(<Toaster />);
    expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument();
  });

  it("shows success toast when toast.success is called", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Save/ }));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });

  it("shows error toast with description when toast.error is called", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Fail/ }));
    expect(await screen.findByText("Failed")).toBeInTheDocument();
    expect(await screen.findByText("Try again")).toBeInTheDocument();
  });

  it("maps deprecated loadingIcon to icons.loading (sonner 2.x compat)", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button onClick={() => toast.loading("Working")}>Load</button>
        <Toaster
          loadingIcon={<span data-testid="legacy-loading-icon" />}
          pauseWhenPageIsHidden
        />
      </>,
    );
    await user.click(screen.getByRole("button", { name: /Load/ }));
    expect(await screen.findByTestId("legacy-loading-icon")).toBeInTheDocument();
  });

  it("has no axe a11y violations (active toast)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /Save/ }));
    await screen.findByText("Saved");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
