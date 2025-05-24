import { BibleStudyPostType } from "@prisma/client";
import { type EnrichedBibleStudyPost } from "../../../server/services/discover-feed-service";
import DiscoverFeedImagePost from "./post/discover-feed-image-post";
import DiscoverFeedTextPost from "./post/discover-feed-text-post";

type Props = {
  post: EnrichedBibleStudyPost;
  index: number;
};

export default function DiscoverFeedCard({ post, index }: Props) {
  switch (post.type) {
    case BibleStudyPostType.TEXT:
      return <DiscoverFeedTextPost post={post} index={index} />;
    case BibleStudyPostType.IMAGE:
      return <DiscoverFeedImagePost post={post} index={index} />;
  }
}
