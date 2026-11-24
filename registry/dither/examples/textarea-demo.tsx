import { Label } from "@/registry/dither/ui/label";
import { Textarea } from "@/registry/dither/ui/textarea";

export default function TextareaDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="textarea-demo">Release notes</Label>
      <Textarea id="textarea-demo" placeholder="What changed in this version?" />
      <p className="text-xs text-muted-foreground">Shown to every member of the workspace.</p>
    </div>
  );
}
