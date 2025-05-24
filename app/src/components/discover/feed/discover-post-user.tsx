import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { type EnrichedBibleStudyPost } from "../../../server/services/discover-feed-service";

type Props = {
  post: EnrichedBibleStudyPost;
};

export default function DiscoverPostUser({ post }: Props) {
  return (
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
  );
}
