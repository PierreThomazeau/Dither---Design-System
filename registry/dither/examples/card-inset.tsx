import { Button } from "@/registry/dither/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardInset, CardTitle } from "@/registry/dither/ui/card";

const rows = [
  { label: "Revenue", value: "€482,900", delta: "+12.4%" },
  { label: "Active projects", value: "128", delta: "+6" },
  { label: "API calls", value: "2.4M", delta: "+18%" },
];

export default function CardInsetDemo() {
  return (
    <Card variant="inset" dither className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Northwind Studio</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
        <CardAction>
          <Button variant="outline" size="xs">Export</Button>
        </CardAction>
      </CardHeader>
      <CardInset className="gap-0 divide-y py-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="flex items-center gap-2">
              <span className="font-mono font-medium tabular">{row.value}</span>
              <span className="font-mono text-xs text-positive-ink tabular">{row.delta}</span>
            </span>
          </div>
        ))}
      </CardInset>
    </Card>
  );
}
