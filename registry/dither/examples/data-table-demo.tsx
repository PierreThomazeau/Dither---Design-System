"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import { DataTable, DataTableSortHeader } from "@/registry/dither/ui/data-table";
import { toast } from "@/registry/dither/ui/toast";

type Invoice = { id: string; client: string; amount: number; status: "Paid" | "Due" | "Overdue"; due: string };

const START: Invoice[] = [
  { id: "INV-1042", client: "Northwind Studio", amount: 4820, status: "Paid", due: "2026-11-02" },
  { id: "INV-1043", client: "Lumen Finance", amount: 12900, status: "Due", due: "2026-11-30" },
  { id: "INV-1044", client: "Atlas Labs", amount: 2150, status: "Overdue", due: "2026-10-18" },
  { id: "INV-1045", client: "Juniper & Co", amount: 7600, status: "Paid", due: "2026-11-09" },
  { id: "INV-1046", client: "Harbor Health", amount: 3380, status: "Due", due: "2026-12-04" },
  { id: "INV-1047", client: "Orbit Retail", amount: 980, status: "Overdue", due: "2026-10-28" },
  { id: "INV-1048", client: "Kite Logistics", amount: 15400, status: "Paid", due: "2026-11-12" },
  { id: "INV-1049", client: "Northwind Studio", amount: 2240, status: "Due", due: "2026-12-11" },
  { id: "INV-1050", client: "Lumen Finance", amount: 6100, status: "Paid", due: "2026-11-20" },
];

const TONE = { Paid: "positive", Due: "secondary", Overdue: "destructive" } as const;

const columns: ColumnDef<Invoice, unknown>[] = [
  { accessorKey: "id", header: "Invoice", cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span> },
  { accessorKey: "client", header: ({ column }) => <DataTableSortHeader column={column}>Client</DataTableSortHeader> },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={TONE[row.original.status]}>{row.original.status}</Badge> },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableSortHeader column={column}>Amount</DataTableSortHeader>,
    cell: ({ row }) => <span className="font-mono tabular">€{row.original.amount.toLocaleString("en-GB")}</span>,
  },
];

export default function DataTableDemo() {
  const [data, setData] = React.useState(START);
  return (
    <DataTable
      className="w-full"
      columns={columns}
      data={data}
      selectable
      pageSize={6}
      getRowId={(r) => r.id}
      searchPlaceholder="Search invoices"
      toolbar={(table) => {
        const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
        return (
          <Button
            variant="outline"
            size="sm"
            disabled={!ids.length}
            onClick={() => {
              const before = data;
              setData((d) => d.filter((r) => !ids.includes(r.id)));
              table.resetRowSelection();
              toast.undo(`Deleted ${ids.length} ${ids.length === 1 ? "invoice" : "invoices"}`, { onUndo: () => setData(before) });
            }}
          >
            Delete selected
          </Button>
        );
      }}
    />
  );
}
