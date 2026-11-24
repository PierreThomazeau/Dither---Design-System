import { Notification01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/dither/ui/alert";
import { Button } from "@/registry/dither/ui/button";

export default function AlertActionDemo() {
  return (
    <Alert variant="brand" className="max-w-md">
      <Icon icon={Notification01Icon} />
      <AlertTitle>Usage at 90%</AlertTitle>
      <AlertDescription>2.2M of 2.4M API calls used.</AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">Upgrade</Button>
      </AlertAction>
    </Alert>
  );
}
