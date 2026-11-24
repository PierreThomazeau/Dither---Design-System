import { Alert02Icon, CheckmarkCircle02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Alert, AlertDescription, AlertTitle } from "@/registry/dither/ui/alert";

export default function AlertDemo() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <Alert>
        <Icon icon={InformationCircleIcon} />
        <AlertTitle>New report template</AlertTitle>
        <AlertDescription>Quarterly revenue reports now include margin by team.</AlertDescription>
      </Alert>
      <Alert variant="positive">
        <Icon icon={CheckmarkCircle02Icon} />
        <AlertTitle>Invoice INV-2048 paid</AlertTitle>
      </Alert>
      <Alert variant="destructive">
        <Icon icon={Alert02Icon} />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Your card was declined. Update your billing details to keep Atlas running.</AlertDescription>
      </Alert>
    </div>
  );
}
