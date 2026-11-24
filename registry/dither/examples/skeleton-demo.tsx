import { Skeleton } from "@/registry/dither/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4 rounded-surface border bg-surface p-5 shadow-xs">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-28 w-full rounded-field" />
      <div className="flex gap-2">
        <Skeleton className="h-control flex-1" />
        <Skeleton className="h-control w-24" />
      </div>
    </div>
  );
}
