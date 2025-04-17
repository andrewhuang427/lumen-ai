import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { type EnrichedBibleStudyPost } from "../../../server/services/discover-feed-service";
import { api } from "../../../trpc/react";
import { Button } from "../../ui/button";

type Props = {
  post: EnrichedBibleStudyPost;
};

export default function DiscoverReaderHeaderPaginateButtons({ post }: Props) {
  const utils = api.useUtils();
  const data = utils.discover.getFeed.getInfiniteData({ limit: 5 });
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const postIndex = posts.findIndex((p) => p.id === post.id);

  return (
    <div className="flex items-center gap-2">
      {posts[postIndex - 1] != null && (
        <Button size="icon" variant="secondary" asChild>
          <Link href={`/discover/${posts[postIndex - 1]?.id}`}>
            <ArrowLeft />
          </Link>
        </Button>
      )}
      {posts[postIndex + 1] != null && (
        <Button size="icon" variant="secondary" asChild>
          <Link href={`/discover/${posts[postIndex + 1]?.id}`}>
            <ArrowRight />
          </Link>
        </Button>
      )}
    </div>
  );
}
