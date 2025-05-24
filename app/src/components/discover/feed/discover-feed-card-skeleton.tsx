import { useState } from "react";
import { useEffect } from "react";
import { Skeleton } from "../../ui/skeleton";
import { DiscoverFeedCardContainer } from "./discover-feed-card-components";

export default function DiscoverFeedCardSkeleton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DiscoverFeedCardContainer>
      <div className="flex items-center">
        <div className="flex grow flex-col gap-2">
          <Skeleton className="h-8 w-full max-w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <div className={getRandomHeight()} />
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
    </DiscoverFeedCardContainer>
  );
}

const heights = ["h-8", "h-16", "h-24", "h-32"];
function getRandomHeight() {
  return heights[Math.floor(Math.random() * heights.length)];
}
