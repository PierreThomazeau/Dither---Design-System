import { RadioGroup, RadioGroupItem } from "@/registry/dither/ui/radio-group";

export default function RadioDemo() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-full max-w-sm" aria-label="Density">
      <RadioGroupItem value="default" label="Default" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="compact" label="Compact" description="More rows on screen." />
      <RadioGroupItem value="disabled" label="Disabled" disabled />
    </RadioGroup>
  );
}
