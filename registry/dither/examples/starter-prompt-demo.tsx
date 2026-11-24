import { Analytics02Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";

import { StarterPrompt } from "@/registry/dither/blocks/starter-prompt";
import { Icon } from "@/registry/dither/lib/icon";

export default function StarterPromptDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <StarterPrompt
        icon={<Icon icon={Analytics02Icon} />}
        title="Explain last week’s revenue drop"
        description="Compare regions week over week and flag the biggest drivers."
      />
      <StarterPrompt icon={<Icon icon={PencilEdit02Icon} />} title="Draft the monthly update" description="Summarise shipped work for the team." />
    </div>
  );
}
