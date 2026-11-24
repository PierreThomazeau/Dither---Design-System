import { Badge } from "@/registry/dither/ui/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="brand">New</Badge>
      <Badge variant="positive">Paid</Badge>
      <Badge variant="destructive">Overdue</Badge>
      <Badge variant="informative">Beta</Badge>
      <Badge variant="tag">Target 70%</Badge>
    </div>
  );
}
