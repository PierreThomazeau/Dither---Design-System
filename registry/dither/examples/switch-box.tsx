import { Switch } from "@/registry/dither/ui/switch";

export default function SwitchBox() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Switch variant="box" placement="end" label="Share across devices" description="Focus is shared across devices." />
      <Switch variant="box" placement="end" label="Notifications" description="Receive notifications when focus mode is on." defaultChecked />
    </div>
  );
}
