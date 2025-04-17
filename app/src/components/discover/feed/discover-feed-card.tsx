import Link from "next/link";
import { type EnrichedBibleStudyPost } from "../../../server/services/discover-feed-service";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import DiscoverPostLikeButton from "../discover-post-like-button";
import { getPostChapterRange } from "../reader/discover-reader-utils";
import {
  DiscoverFeedCardChip,
  DiscoverFeedCardContainer,
  DiscoverFeedCardDescription,
  DiscoverFeedCardFooter,
  DiscoverFeedCardHeader,
  DiscoverFeedCardTitle,
} from "./discover-feed-card-components";

type Props = {
  post: EnrichedBibleStudyPost;
  index: number;
};

export default function DiscoverFeedCard({ post, index }: Props) {
  return (
    <DiscoverFeedCardContainer border={index > 0}>
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
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarImage src={post.user.avatar_url ?? undefined} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <Link
              href={`/@${post.user.username}`}
              className="cursor-pointer text-sm font-medium hover:underline"
            >
              {post.user.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              {post.created_at.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </DiscoverFeedCardFooter>
    </DiscoverFeedCardContainer>
  );
}
