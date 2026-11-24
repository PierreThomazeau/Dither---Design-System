import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/dither/ui/select";

export default function SelectSizes() {
  return (
    <div className="flex flex-col items-center gap-2">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Select key={size}>
          <SelectTrigger size={size} aria-label={`Team (${size})`}>
            <SelectValue placeholder={`Team · ${size}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
