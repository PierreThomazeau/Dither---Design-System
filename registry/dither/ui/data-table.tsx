"use client";

import * as React from "react";
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon, Search02Icon } from "@hugeicons/core-free-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
  type Table as TanTable,
} from "@tanstack/react-table";

import { Icon } from "@/registry/dither/lib/icon";
import { cn } from "@/registry/dither/lib/utils";
import { Button } from "@/registry/dither/ui/button";
import { Checkbox } from "@/registry/dither/ui/checkbox";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/registry/dither/ui/empty";
import { Input } from "@/registry/dither/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/dither/ui/table";

/* ------------------------------------------------------------------ *
 * DataTable (TanStack Table on the Dither Table): sort by clicking a
 * header, global search, row selection, pagination, a dither empty
 * state. `toolbar` receives the table (e.g. "Delete selected").
 * ------------------------------------------------------------------ */

export interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  /** Adds a checkbox column. */
  selectable?: boolean;
  /** Search box placeholder; omit to hide the search. */
  searchPlaceholder?: string;
  pageSize?: number;
  getRowId?: (row: T) => string;
  toolbar?: (table: TanTable<T>) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

/** Sortable header: click to sort, again to reverse. */
function DataTableSortHeader<T>({ column, children }: { column: Column<T, unknown>; children: React.ReactNode }) {
  const dir = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="-ml-2 inline-flex h-7 items-center gap-1 rounded-control px-2 text-xs font-medium outline-none hover:bg-hover hover:text-foreground focus-visible:shadow-focus"
      aria-label={`Sort by ${typeof children === "string" ? children : "column"}`}
    >
      {children}
      <Icon icon={dir === "asc" ? ArrowUp01Icon : dir === "desc" ? ArrowDown01Icon : ArrowUpDownIcon} size={12} className={cn(!dir && "opacity-50")} />
    </button>
  );
}

function DataTable<T>({
  columns,
  data,
  selectable = false,
  searchPlaceholder,
  pageSize = 8,
  getRowId,
  toolbar,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Try another search, or add the first item.",
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const cols = React.useMemo<ColumnDef<T, unknown>[]>(() => {
    if (!selectable) return columns;
    return [
      {
        id: "select",
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all rows"
            checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(v === true)}
          />
        ),
        cell: ({ row }) => <Checkbox aria-label="Select row" checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(v === true)} />,
      },
      ...columns,
    ];
  }, [columns, selectable]);

  // TanStack Table returns non-memoizable functions; the React Compiler skips this component.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: cols,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const rows = table.getRowModel().rows;
  const total = table.getFilteredRowModel().rows.length;
  const { pageIndex } = table.getState().pagination;

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-3", className)}>
      {searchPlaceholder || toolbar ? (
        <div className="flex flex-wrap items-center gap-2">
          {searchPlaceholder ? (
            <div className="relative w-full max-w-xs">
              <Icon icon={Search02Icon} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input size="sm" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder={searchPlaceholder} className="pl-9" aria-label={searchPlaceholder} />
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-2">{toolbar?.(table)}</div>
        </div>
      ) : null}
      <div className="overflow-hidden rounded-field border bg-surface shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className={h.column.id === "select" ? "w-10" : undefined} aria-sort={h.column.getIsSorted() === "asc" ? "ascending" : h.column.getIsSorted() === "desc" ? "descending" : undefined}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={cols.length} className="p-2">
                  <Empty variant="dither" className="min-h-48 border-0">
                    <EmptyHeader>
                      <EmptyTitle>{emptyTitle}</EmptyTitle>
                      <EmptyDescription>{emptyDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span className="font-mono text-xs tabular">
          {selectable && Object.keys(rowSelection).length ? `${Object.keys(rowSelection).length} selected · ` : ""}
          {total} {total === 1 ? "row" : "rows"}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs tabular">
            {table.getPageCount() ? pageIndex + 1 : 0} / {table.getPageCount()}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DataTable, DataTableSortHeader };
