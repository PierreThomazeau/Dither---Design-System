import { UserIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/registry/dither/lib/icon";
import { Avatar, AvatarFallback } from "@/registry/dither/ui/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-3">
        {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} size={size}>
            <AvatarFallback>LM</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-end gap-3">
        <Avatar><AvatarFallback className="bg-brand text-brand-foreground">NS</AvatarFallback></Avatar>
        <Avatar><AvatarFallback><Icon icon={UserIcon} /></AvatarFallback></Avatar>
      </div>
    </div>
  );
}
