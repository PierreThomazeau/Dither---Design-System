import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/dither/ui/select";

export default function SelectDemo() {
  return (
    <Select defaultValue="30d">
      <SelectTrigger aria-label="Period">
        <SelectValue placeholder="Select a period" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Period</SelectLabel>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="custom" disabled>Custom range</SelectItem>
      </SelectContent>
    </Select>
  );
}
