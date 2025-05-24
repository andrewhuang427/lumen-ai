import { useMemo } from "react";
import { type EnrichedBibleStudyPost } from "../../../../server/services/discover-feed-service";
import DiscoverPostLikeButton from "../../discover-post-like-button";
import {
  DiscoverFeedCardContainer,
  DiscoverFeedCardFooter,
} from "../discover-feed-card-components";
import DiscoverPostUser from "../discover-post-user";

type Props = {
  post: EnrichedBibleStudyPost;
};

export default function DiscoverFeedImagePost({ post }: Props) {
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
    <DiscoverFeedCardContainer>
      <div className="relative w-full overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={post.title ?? "Image post"}
          className="object-contain"
        />
      </div>
      <DiscoverFeedCardFooter>
        <DiscoverPostUser post={post} />
        <DiscoverPostLikeButton post={post} />
      </DiscoverFeedCardFooter>
    </DiscoverFeedCardContainer>
  );
}
