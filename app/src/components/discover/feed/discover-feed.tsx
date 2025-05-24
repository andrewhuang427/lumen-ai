"use client";

import { useMemo } from "react";
import Masonry from "react-masonry-css";
import { api } from "../../../trpc/react";
import InfiniteScrollTrigger from "../../infinite-scroll-trigger";
import DiscoverFeedCard from "./discover-feed-card";
import DiscoverFeedCardSkeleton from "./discover-feed-card-skeleton";
import DiscoverFeedContainer from "./discover-feed-container";
import DiscoverEmptyFeed from "./discover-feed-empty-state";

const MASONRY_BREAKPOINTS = { default: 3, 1100: 2, 700: 1 };

export default function DiscoverFeed() {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    api.discover.getFeed.useInfiniteQuery(
      { limit: 8 },
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
        <Masonry
          breakpointCols={MASONRY_BREAKPOINTS}
          className="discover-masonry-grid"
          columnClassName="discover-masonry-grid_column"
        >
          {posts.map((post) => (
            <DiscoverFeedCard key={post.id} post={post} />
          ))}
          {(isLoading || isFetchingNextPage) &&
            Array.from({ length: 10 }).map((_, i) => (
              <DiscoverFeedCardSkeleton key={i} />
            ))}
        </Masonry>
      )}
      <InfiniteScrollTrigger
        onTrigger={fetchNextPage}
        enabled={hasNextPage && !isFetchingNextPage}
      />
    </DiscoverFeedContainer>
  );
}
