import { cn } from "../../../lib/utils";

import { Skeleton } from "../../ui/skeleton";

type Props = {
  border?: boolean;
};

export default function DiscoverFeedCardSkeleton({ border = true }: Props) {
  return (
    <div
      className={cn("flex flex-col justify-between p-6", border && "border-t")}
    >
      <div className="flex items-center">
        <div className="flex grow flex-col gap-2">
          <Skeleton className="h-8 w-full max-w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex grow items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
