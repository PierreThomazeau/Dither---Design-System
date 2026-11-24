import { DollarCircleIcon, UserGroupIcon, Analytics01Icon } from "@hugeicons/core-free-icons";

import { StatCard } from "@/registry/dither/blocks/stat-card";
import { Icon } from "@/registry/dither/lib/icon";

export default function StatCardDemo() {
  return (
    <div className="grid w-full max-w-xs gap-3">
      <StatCard
        label="Revenue"
        value="€482.9k"
        delta="+12.4%"
        caption="vs last month"
        trend="up"
        icon={<Icon icon={DollarCircleIcon} />}
        sparkline={[12, 14, 13, 16, 15, 18, 17, 21, 20, 24]}
      />
      <StatCard
        label="Churned accounts"
        value="18"
        delta="+3"
        caption="vs last month"
        trend="down"
        icon={<Icon icon={UserGroupIcon} />}
        sparkline={[20, 19, 21, 18, 17, 16, 18, 15, 14, 12]}
      />
      <StatCard
        label="API latency"
        value="142 ms"
        delta="0%"
        caption="p95, stable"
        trend="neutral"
        icon={<Icon icon={Analytics01Icon} />}
        sparkline={[14, 15, 14, 15, 14, 14, 15, 14, 15, 14]}
      />
    </div>
  );
}
