import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

function Sample({ onDelete }: { onDelete?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>削除</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか?</AlertDialogTitle>
          <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>削除する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe("AlertDialog", () => {
  it("trigger is rendered when closed", () => {
    render(<Sample />);
    expect(screen.getByRole("button", { name: /削除/ })).toBeInTheDocument();
  });

  it("opens with role=alertdialog (not dialog)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /削除/ }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
  });

  it("clicking action invokes onClick", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Sample onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: /^削除$/ }));
    await user.click(await screen.findByRole("button", { name: /削除する/ }));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("clicking cancel closes the dialog", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /^削除$/ }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: /キャンセル/ }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("title and description are accessible", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /^削除$/ }));
    const ad = await screen.findByRole("alertdialog");
    expect(ad).toHaveAttribute("aria-labelledby");
    expect(ad).toHaveAttribute("aria-describedby");
  });

  it("applies motion-reduce:animate-none on content (WCAG 2.3.3)", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: /^削除$/ }));
    const ad = await screen.findByRole("alertdialog");
    expect(ad).toHaveClass("motion-reduce:animate-none");
  });
});
