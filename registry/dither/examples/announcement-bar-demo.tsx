import { Alert02Icon, Megaphone01Icon, SparklesIcon } from "@hugeicons/core-free-icons";

import { AnnouncementBar } from "@/registry/dither/blocks/announcement-bar";
import { Icon } from "@/registry/dither/lib/icon";

export default function AnnouncementBarDemo() {
  return (
    <div className="grid w-full gap-2">
      <AnnouncementBar icon={<Icon icon={Megaphone01Icon} />} action={<a href="#">Learn more →</a>}>
        Workspace analytics is now live.
      </AnnouncementBar>
      <AnnouncementBar variant="promo" icon={<Icon icon={SparklesIcon} />} action={<a href="#">Upgrade →</a>}>
        Pro is 20% off this week.
      </AnnouncementBar>
      <AnnouncementBar variant="warning" icon={<Icon icon={Alert02Icon} />} action={<a href="#">Status →</a>}>
        Scheduled maintenance Sunday 02:00 UTC.
      </AnnouncementBar>
    </div>
  );
}
