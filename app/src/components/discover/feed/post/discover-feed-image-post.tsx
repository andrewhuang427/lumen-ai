import { useMemo } from "react";
import { type EnrichedBibleStudyPost } from "../../../../server/services/discover-feed-service";
import DiscoverPostLikeButton from "../../discover-post-like-button";
import {
  DiscoverFeedCardContainer,
  DiscoverFeedCardFooter,
} from "../discover-feed-card-components";

type Props = {
  post: EnrichedBibleStudyPost;
  index: number;
};

export default function DiscoverFeedImagePost({ post, index }: Props) {
  const image = useMemo(() => {
    if (post.images.length === 0) {
      return null;
    }
    return post.images[0];
  }, [post.images]);

  if (image == null) {
    return null;
  }

  return (
    <DiscoverFeedCardContainer border={index > 0}>
      <div className="relative w-full overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={post.title ?? "Image post"}
          className="object-contain"
        />
      </div>
      <DiscoverFeedCardFooter>
        <DiscoverPostLikeButton post={post} />
      </DiscoverFeedCardFooter>
    </DiscoverFeedCardContainer>
  );
}
