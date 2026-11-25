import { Badge } from "@/registry/dither/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/dither/ui/table";

const rows = [
  { id: "INV-2026-0412", customer: "Acme Corp", amount: "€126,000", status: "Paid" },
  { id: "INV-2026-0411", customer: "Globex", amount: "€18,450", status: "Pending" },
  { id: "INV-2026-0409", customer: "Initech", amount: "€42,900", status: "Overdue" },
];

export default function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs">{r.id}</TableCell>
            <TableCell>{r.customer}</TableCell>
            <TableCell className="text-right font-mono tabular">{r.amount}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Overdue" ? "destructive" : r.status === "Paid" ? "secondary" : "outline"}>{r.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
