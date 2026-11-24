import { Analytics02Icon, ChartLineData01Icon, Invoice01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

import { StarterPrompt } from "@/registry/dither/blocks/starter-prompt";
import { Icon } from "@/registry/dither/lib/icon";

const prompts = [
  { icon: Analytics02Icon, title: "Revenue by team" },
  { icon: Invoice01Icon, title: "Overdue invoices" },
  { icon: UserGroupIcon, title: "Accounts at risk" },
  { icon: ChartLineData01Icon, title: "Forecast Q1" },
];

export default function StarterPromptEmptyChat() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <p className="text-lg font-semibold tracking-tight">Good afternoon, Léa</p>
      <div className="grid w-full grid-cols-2 gap-2">
        {prompts.map((p) => (
          <StarterPrompt key={p.title} icon={<Icon icon={p.icon} />} title={p.title} />
        ))}
      </div>
    </div>
  );
}
