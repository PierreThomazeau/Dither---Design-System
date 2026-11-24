import { RadioGroup, RadioGroupItem } from "@/registry/dither/ui/radio-group";

export default function RadioBox() {
  return (
    <RadioGroup defaultValue="pro" className="w-full max-w-sm gap-2" aria-label="Plan">
      <RadioGroupItem variant="box" placement="end" value="free" label="Free" description="Up to 3 projects." />
      <RadioGroupItem variant="box" placement="end" value="pro" label="Pro" description="Unlimited projects and reports." />
      <RadioGroupItem variant="box" placement="end" value="team" label="Team" description="Shared workspaces and roles." />
    </RadioGroup>
  );
}
