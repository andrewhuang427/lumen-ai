"use client";

import { useMemo } from "react";
import { api } from "../../../trpc/react";
import InfiniteScrollTrigger from "../../infinite-scroll-trigger";
import DiscoverFeedCard from "./discover-feed-card";
import DiscoverFeedCardSkeleton from "./discover-feed-card-skeleton";
import DiscoverFeedContainer from "./discover-feed-container";
import DiscoverEmptyFeed from "./discover-feed-empty-state";

export default function DiscoverFeed() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    api.discover.getFeed.useInfiniteQuery(
      { limit: 5 },
      { getNextPageParam: (response) => response.nextCursor },
    );

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.posts) ?? [];
  }, [data?.pages]);

  return (
    <DiscoverFeedContainer shouldScrollSavedPosition={posts.length > 0}>
      {!isLoading && posts.length === 0 ? (
        <DiscoverEmptyFeed />
      ) : (
        posts.map((post, index) => (
          <DiscoverFeedCard key={post.id} index={index} post={post} />
        ))
      )}
      {(isLoading || isFetchingNextPage) && (
        <>
          <DiscoverFeedCardSkeleton border={!isLoading} />
          <DiscoverFeedCardSkeleton />
          <DiscoverFeedCardSkeleton />
          <DiscoverFeedCardSkeleton />
          <DiscoverFeedCardSkeleton />
        </>
      )}
      <InfiniteScrollTrigger
        onTrigger={fetchNextPage}
        enabled={hasNextPage && !isFetchingNextPage}
      />
    </DiscoverFeedContainer>
  );
}
