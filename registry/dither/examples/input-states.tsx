import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";

export default function InputStates() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <div className="grid gap-2">
        <Label htmlFor="input-states-invalid">Project name</Label>
        <Input id="input-states-invalid" aria-invalid defaultValue="Atlas" />
        <p className="text-xs text-destructive-ink">A project with this name already exists.</p>
      </div>
      <Input disabled placeholder="Disabled" />
      <Input type="file" aria-label="Attachment" />
    </div>
  );
}
