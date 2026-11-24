import { Checkbox } from "@/registry/dither/ui/checkbox";

export default function CheckboxDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Checkbox label="Accept terms and conditions" defaultChecked />
      <Checkbox label="Weekly digest" description="A summary of revenue and reports every Monday." />
      <Checkbox label="Select all" checked="indeterminate" />
      <Checkbox label="Required" description="You must accept to continue." invalid />
      <Checkbox label="Disabled" disabled />
    </div>
  );
}
