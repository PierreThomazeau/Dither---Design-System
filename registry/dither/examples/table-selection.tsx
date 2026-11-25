import { Checkbox } from "@/registry/dither/ui/checkbox";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/registry/dither/ui/table";

const rows = [
  { team: "Growth", owner: "Inès Moreau", budget: "€240k", selected: true },
  { team: "Core platform", owner: "Hugo Lambert", budget: "€310k" },
  { team: "Design system", owner: "Léa Dubois", budget: "€180k", selected: true },
];

export default function TableSelection() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox aria-label="Select all" checked="indeterminate" />
          </TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="text-right">Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.team} data-state={r.selected ? "selected" : undefined}>
            <TableCell>
              <Checkbox aria-label={`Select ${r.team}`} defaultChecked={r.selected} />
            </TableCell>
            <TableCell className="font-medium">{r.team}</TableCell>
            <TableCell className="text-muted-foreground">{r.owner}</TableCell>
            <TableCell className="text-right font-mono tabular">{r.budget}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right font-mono tabular">€730k</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
