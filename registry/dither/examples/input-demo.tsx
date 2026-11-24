import { Input } from "@/registry/dither/ui/input";
import { Label } from "@/registry/dither/ui/label";

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="input-demo-email">Work email</Label>
      <Input id="input-demo-email" type="email" placeholder="you@northwind.studio" />
    </div>
  );
}
