import { UsageMeter } from "@/registry/dither/blocks/usage-meter";

export default function UsageMeterDemo() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <UsageMeter
        label="API calls"
        max={10000}
        segments={[{ label: "Production", value: 4200 }, { label: "Staging", value: 2040 }]}
        caption="62% used · resets Dec 1"
      />
      <UsageMeter
        label="Storage"
        max={500}
        segments={[{ label: "Files", value: 340 }, { label: "Backups", value: 72 }]}
        status="warning"
        caption="82% used"
        format={(n) => `${n} GB`}
      />
      <UsageMeter label="Seats" max={25} segments={[{ label: "Members", value: 25 }]} status="critical" caption="No seats left" />
    </div>
  );
}
