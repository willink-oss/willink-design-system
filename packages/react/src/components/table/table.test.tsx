import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

function SampleTable() {
  return (
    <Table>
      <TableCaption>2026年5月の利用状況</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>プラン</TableHead>
          <TableHead>ユーザー数</TableHead>
          <TableHead>金額</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Pro</TableCell>
          <TableCell>128</TableCell>
          <TableCell>¥153,600</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Business</TableCell>
          <TableCell>42</TableCell>
          <TableCell>¥84,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("renders native table structure with caption / header / body", () => {
    render(<SampleTable />);
    const table = screen.getByRole("table");
    expect(table.tagName).toBe("TABLE");
    expect(table).toHaveClass("w-full", "caption-bottom", "text-sm");

    // caption
    expect(screen.getByText("2026年5月の利用状況").tagName).toBe("CAPTION");

    // column headers (th → columnheader role)
    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders).toHaveLength(3);
    expect(columnHeaders[0]).toHaveClass("text-fg-secondary", "font-medium");

    // data rows: 1 header row + 2 body rows
    expect(screen.getAllByRole("row")).toHaveLength(3);

    // data cells
    const cell = screen.getByText("Pro");
    expect(cell.tagName).toBe("TD");
    expect(cell).toHaveClass("text-fg", "align-middle");
  });

  it("wraps the table in a horizontal scroll container", () => {
    const { container } = render(<SampleTable />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper).toHaveClass("relative", "w-full", "overflow-x-auto");
  });

  it("merges custom className on each sub-component", () => {
    render(
      <Table className="table-extra" data-testid="t">
        <TableBody>
          <TableRow className="row-extra" data-testid="r">
            <TableCell className="cell-extra" data-testid="c">
              x
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId("t")).toHaveClass("table-extra", "w-full");
    expect(screen.getByTestId("r")).toHaveClass("row-extra", "border-b");
    expect(screen.getByTestId("c")).toHaveClass("cell-extra", "text-fg");
  });

  it("has no axe a11y violations (full header + body table)", async () => {
    const { container } = render(<SampleTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
