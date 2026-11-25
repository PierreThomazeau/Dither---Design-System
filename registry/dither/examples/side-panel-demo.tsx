"use client";

import { Badge } from "@/registry/dither/ui/badge";
import { Button } from "@/registry/dither/ui/button";
import {
  SidePanel,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelInset,
  SidePanelLayout,
  SidePanelProvider,
  SidePanelTrigger,
} from "@/registry/dither/ui/side-panel";

const rows = [
  ["INV-2041", "Lumen Finance", "$12,400"],
  ["INV-2040", "Northwind Studio", "$4,180"],
  ["INV-2039", "Atlas Labs", "$9,920"],
];

export default function SidePanelDemo() {
  return (
    <SidePanelProvider>
      <SidePanelLayout className="h-96 w-full overflow-hidden rounded-surface border bg-background">
        <SidePanelInset className="gap-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Invoices</h3>
            <SidePanelTrigger asChild>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </SidePanelTrigger>
          </div>
          <ul className="flex flex-col gap-2">
            {rows.map(([id, client, amount]) => (
              <li key={id} className="flex items-center justify-between gap-3 rounded-control-min border bg-surface px-4 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground tabular">{id}</span>
                <span className="min-w-0 flex-1 truncate">{client}</span>
                <span className="font-mono tabular">{amount}</span>
              </li>
            ))}
          </ul>
        </SidePanelInset>
        <SidePanel width={300} label="Invoice details">
          <SidePanelHeader title="INV-2041" description="Lumen Finance" />
          <SidePanelContent>
            <div className="flex gap-1.5">
              <Badge variant="positive">Paid</Badge>
              <Badge variant="outline">Bank transfer</Badge>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">Settled on Nov 24. The list keeps its own space: the panel pushes it instead of covering it.</p>
          </SidePanelContent>
          <SidePanelFooter>
            <Button size="sm">Download</Button>
          </SidePanelFooter>
        </SidePanel>
      </SidePanelLayout>
    </SidePanelProvider>
  );
}
