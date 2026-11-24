import { OnboardingChecklist } from "@/registry/dither/blocks/onboarding-checklist";
import { Button } from "@/registry/dither/ui/button";

export default function OnboardingChecklistDemo() {
  return (
    <OnboardingChecklist
      title="Set up your workspace"
      steps={[
        { label: "Connect a data source", done: true },
        { label: "Invite your team", done: true },
        { label: "Create a first report", done: true },
        { label: "Set up alerts", href: "#alerts" },
        { label: "Share a report", href: "#share" },
      ]}
      actions={
        <>
          <Button size="sm">Continue setup</Button>
          <Button size="sm" variant="ghost">Dismiss</Button>
        </>
      }
    />
  );
}
