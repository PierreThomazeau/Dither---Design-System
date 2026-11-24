import { Input } from "@/registry/dither/ui/input";

export default function InputSizes() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Input size="xs" placeholder="Extra small · 32" />
      <Input size="sm" placeholder="Small · 36" />
      <Input placeholder="Default · 40" />
      <Input size="lg" placeholder="Large · 44" />
    </div>
  );
}
