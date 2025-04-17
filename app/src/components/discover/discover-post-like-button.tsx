import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { type EnrichedBibleStudyPost } from "../../server/services/discover-feed-service";
import useAuth from "../auth/use-auth";
import ParticleEffect from "../particles-effect";
import { Button } from "../ui/button";
import useLikePost from "./use-like-post";

type Props = {
  post: EnrichedBibleStudyPost;
};

export default function DiscoverPostLikeButton({ post }: Props) {
  const [showParticles, setShowParticles] = useState(false);
  const { likePost, isPending } = useLikePost();
  const { user } = useAuth();

  const isLiked = post.likes.some((like) => like.user_id === user?.id);

  async function handleLike(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const like = await likePost(post);
    setShowParticles(like != null);
  }

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={handleLike}
      className="relative"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isLiked ? (
        <Heart fill="currentColor" className="size-4 text-red-500" />
      ) : (
        <Heart className="size-4" />
      )}
      {post.likes.length}
      {showParticles && <ParticleEffect />}
    </Button>
  );
}
