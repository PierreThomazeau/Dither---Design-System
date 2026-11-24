import { Switch } from "@/registry/dither/ui/switch";

export default function SwitchDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Switch label="Airplane mode" defaultChecked />
      <Switch label="Small" size="sm" />
      <Switch label="Share across devices" description="Focus is shared across devices, and turns off when you leave the app." placement="end" />
      <Switch label="Accept terms and conditions" description="You must accept the terms to continue." invalid />
      <Switch label="Disabled" disabled />
    </div>
  );
}
