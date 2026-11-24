import { Checkbox } from "@/registry/dither/ui/checkbox";

export default function CheckboxBox() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Checkbox variant="box" label="Share across devices" description="Focus mode follows you on every device." defaultChecked />
      <Checkbox variant="box" placement="end" label="Email notifications" description="Get an email when a report is ready." />
    </div>
  );
}
