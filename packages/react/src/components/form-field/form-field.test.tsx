import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import { Input } from "../input";
import { Textarea } from "../textarea";
import {
  FormField,
  FormFieldControl,
  FormFieldDescription,
  FormFieldError,
  FormFieldLabel,
} from "./form-field";

describe("FormField", () => {
  it("wires the label to the control via a generated id", () => {
    render(
      <FormField>
        <FormFieldLabel>Email</FormFieldLabel>
        <FormFieldControl>
          <Input type="email" />
        </FormFieldControl>
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input.id).not.toBe("");
  });

  it("links the description to the control via aria-describedby", () => {
    render(
      <FormField>
        <FormFieldLabel>Email</FormFieldLabel>
        <FormFieldControl>
          <Input type="email" />
        </FormFieldControl>
        <FormFieldDescription>We never share your email.</FormFieldDescription>
      </FormField>,
    );
    const description = screen.getByText("We never share your email.");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-describedby",
      description.id,
    );
  });

  it("merges description and error ids into aria-describedby (description first)", () => {
    render(
      <FormField>
        <FormFieldLabel>Email</FormFieldLabel>
        <FormFieldControl>
          <Input type="email" />
        </FormFieldControl>
        <FormFieldDescription>We never share your email.</FormFieldDescription>
        <FormFieldError>Invalid email address.</FormFieldError>
      </FormField>,
    );
    const description = screen.getByText("We never share your email.");
    const error = screen.getByText("Invalid email address.");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-describedby",
      `${description.id} ${error.id}`,
    );
  });

  it("merges a consumer-supplied aria-describedby with the generated ids", () => {
    render(
      <>
        <p id="external-hint">External hint</p>
        <FormField>
          <FormFieldLabel>Email</FormFieldLabel>
          <FormFieldControl aria-describedby="external-hint">
            <Input type="email" />
          </FormFieldControl>
          <FormFieldDescription>We never share your email.</FormFieldDescription>
        </FormField>
      </>,
    );
    const description = screen.getByText("We never share your email.");
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-describedby",
      `external-hint ${description.id}`,
    );
  });

  it("sets aria-invalid on the control and role=alert on the message when an error is present", () => {
    render(
      <FormField>
        <FormFieldLabel>Email</FormFieldLabel>
        <FormFieldControl>
          <Input type="email" />
        </FormFieldControl>
        <FormFieldError>Invalid email address.</FormFieldError>
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Invalid email address.");
    expect(error).toHaveClass("text-danger");
  });

  it("renders no error and no aria-invalid when FormFieldError has no content", () => {
    render(
      <FormField>
        <FormFieldLabel>Email</FormFieldLabel>
        <FormFieldControl>
          <Input type="email" />
        </FormFieldControl>
        <FormFieldDescription>We never share your email.</FormFieldDescription>
        <FormFieldError>{undefined}</FormFieldError>
      </FormField>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    const input = screen.getByLabelText("Email");
    expect(input).not.toHaveAttribute("aria-invalid");
    // describedby carries only the description id — no dangling error id
    expect(input.getAttribute("aria-describedby")).toBe(
      screen.getByText("We never share your email.").id,
    );
  });

  it("invalid prop forces aria-invalid without an error message", () => {
    render(
      <FormField invalid>
        <FormFieldLabel>Email</FormFieldLabel>
        <FormFieldControl>
          <Input type="email" />
        </FormFieldControl>
      </FormField>,
    );
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("composes with Textarea and native controls via Slot", () => {
    render(
      <>
        <FormField>
          <FormFieldLabel>Message</FormFieldLabel>
          <FormFieldControl>
            <Textarea rows={4} />
          </FormFieldControl>
          <FormFieldDescription>Up to 500 characters.</FormFieldDescription>
        </FormField>
        <FormField>
          <FormFieldLabel>Plan</FormFieldLabel>
          <FormFieldControl>
            <select>
              <option>Free</option>
            </select>
          </FormFieldControl>
        </FormField>
      </>,
    );
    const textarea = screen.getByLabelText("Message");
    expect(textarea).toBeInstanceOf(HTMLTextAreaElement);
    expect(textarea).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Up to 500 characters.").id,
    );
    expect(screen.getByLabelText("Plan")).toBeInstanceOf(HTMLSelectElement);
  });

  it("forwards refs (wrapper div + control element)", () => {
    const fieldRef = { current: null as HTMLDivElement | null };
    const controlRef = { current: null as HTMLElement | null };
    render(
      <FormField ref={fieldRef}>
        <FormFieldLabel>Email</FormFieldLabel>
        <FormFieldControl ref={controlRef}>
          <Input type="email" />
        </FormFieldControl>
      </FormField>,
    );
    expect(fieldRef.current).toBeInstanceOf(HTMLDivElement);
    expect(controlRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it("merges custom className via cn()", () => {
    render(
      <FormField data-testid="field" className="max-w-md">
        <FormFieldLabel>Email</FormFieldLabel>
        <FormFieldControl>
          <Input type="email" />
        </FormFieldControl>
        <FormFieldDescription className="italic">Hint</FormFieldDescription>
      </FormField>,
    );
    expect(screen.getByTestId("field")).toHaveClass("grid", "gap-2", "max-w-md");
    expect(screen.getByText("Hint")).toHaveClass("italic", "text-muted");
  });

  it("throws a descriptive error when subcomponents are used outside FormField", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<FormFieldLabel>Email</FormFieldLabel>)).toThrow(
      "<FormFieldLabel> must be used within <FormField>",
    );
    spy.mockRestore();
  });

  it("has no axe a11y violations (label + control + description + error)", async () => {
    const { container } = render(
      <FormField>
        <FormFieldLabel required>Email</FormFieldLabel>
        <FormFieldControl>
          <Input type="email" defaultValue="taro@example" />
        </FormFieldControl>
        <FormFieldDescription>We never share your email.</FormFieldDescription>
        <FormFieldError>Invalid email address.</FormFieldError>
      </FormField>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
