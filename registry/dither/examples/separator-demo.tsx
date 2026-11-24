import { Separator } from "@/registry/dither/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-xs text-sm">
      <p className="font-medium">Lumen Finance</p>
      <p className="text-muted-foreground">Workspace settings</p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4">
        <span>Members</span>
        <Separator orientation="vertical" />
        <span>Billing</span>
        <Separator orientation="vertical" />
        <span>API</span>
      </div>
    </div>
  );
}
