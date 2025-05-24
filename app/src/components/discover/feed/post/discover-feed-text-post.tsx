import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type EnrichedBibleStudyPost } from "../../../../server/services/discover-feed-service";
import { Button } from "../../../ui/button";
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
  const router = useRouter();

  function handleReadPost() {
    router.push(`/discover/${post.id}`);
  }

  return (
    <DiscoverFeedCardContainer
      onClick={handleReadPost}
      className="ease-[cubic-bezier(0.22,1,0.36,1)] transition-all duration-500 hover:scale-[1.025] hover:border-primary hover:shadow-lg"
    >
      <DiscoverFeedCardHeader>
        <div className="flex items-center justify-between gap-2">
          <DiscoverFeedCardTitle>{post.title}</DiscoverFeedCardTitle>
          <DiscoverFeedCardChip>
            {getPostChapterRange(post)}
          </DiscoverFeedCardChip>
        </div>
        <DiscoverFeedCardDescription>
          {post.description}
        </DiscoverFeedCardDescription>
      </DiscoverFeedCardHeader>

      <DiscoverFeedCardFooter className="mt-8">
        <DiscoverPostUser post={post} />
        <div className="flex items-center gap-2">
          <DiscoverPostLikeButton post={post} />
          <Button variant="outline" onClick={handleReadPost}>
            Read post
            <ArrowRightIcon />
          </Button>
        </div>
      </DiscoverFeedCardFooter>
    </DiscoverFeedCardContainer>
  );
}
