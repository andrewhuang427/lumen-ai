import Link from "next/link";
import { type EnrichedBibleStudyPost } from "../../../../server/services/discover-feed-service";
import DiscoverPostLikeButton from "../../discover-post-like-button";
import { getPostChapterRange } from "../../reader/discover-reader-utils";
import {
  DiscoverFeedCardChip,
  DiscoverFeedCardContainer,
  DiscoverFeedCardDescription,
  DiscoverFeedCardFooter,
  DiscoverFeedCardHeader,
  DiscoverFeedCardTitle,
} from "../discover-feed-card-components";
import DiscoverPostUser from "../discover-post-user";

type Props = {
  post: EnrichedBibleStudyPost;
};

export default function DiscoverFeedTextPost({ post }: Props) {
  return (
    <DiscoverFeedCardContainer>
      <DiscoverFeedCardHeader>
        <div className="flex items-center justify-between gap-2">
          <Link
            key={post.id}
            href={`/discover/${post.id}`}
            className="hover:underline"
          >
            <DiscoverFeedCardTitle>{post.title}</DiscoverFeedCardTitle>
          </Link>
          <DiscoverFeedCardChip>
            {getPostChapterRange(post)}
          </DiscoverFeedCardChip>
        </div>
        <DiscoverFeedCardDescription>
          {post.description}
        </DiscoverFeedCardDescription>
      </DiscoverFeedCardHeader>

      <DiscoverFeedCardFooter className="mt-8">
        <DiscoverPostLikeButton post={post} />
        <DiscoverPostUser post={post} />
      </DiscoverFeedCardFooter>
    </DiscoverFeedCardContainer>
  );
}
