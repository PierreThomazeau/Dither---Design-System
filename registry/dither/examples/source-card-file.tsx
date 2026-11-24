import { File02Icon } from "@hugeicons/core-free-icons";

import { SourceCard } from "@/registry/dither/blocks/source-card";
import { Icon } from "@/registry/dither/lib/icon";

export default function SourceCardFile() {
  return <SourceCard index={3} icon={<Icon icon={File02Icon} />} title="invoices_2026.csv" meta="CSV · 248 rows" />;
}
