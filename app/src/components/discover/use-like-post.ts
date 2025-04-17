import { type EnrichedBibleStudyPost } from "../../server/services/discover-feed-service";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";

export default function useLikePost() {
  const { user } = useAuth();
  const { mutateAsync: like, isPending } = api.discover.likePost.useMutation();
  const utils = api.useUtils();

  async function likePost(post: EnrichedBibleStudyPost) {
    // 1. Like the post
    const newLike = await like(post.id);
    const isLikeRemoved = newLike == null;

    // 2. update getPost results in the cache
    utils.discover.getPost.setData(post.id, (previousData) => {
      if (previousData == null) {
        return previousData;
      }
      const updatedLikes = isLikeRemoved
        ? previousData.likes.filter((l) => l.user_id !== user?.id)
        : [...previousData.likes, newLike];

      return { ...previousData, likes: updatedLikes };
    });

    // 3. update getFeed results in the cache
    utils.discover.getFeed.setInfiniteData({ limit: 5 }, (data) => {
      if (data == null) {
        return data;
      }
      const updatedPages = data.pages.map((page) => {
        const posts = page.posts;
        return {
          ...page,
          posts: posts.map((p) => {
            if (p.id === post.id) {
              const updatedLikes = isLikeRemoved
                ? p.likes.filter((l) => l.user_id !== user?.id)
                : [...p.likes, newLike];
              return { ...p, likes: updatedLikes };
            } else {
              return p;
            }
          }),
        };
      });
      return { ...data, pages: updatedPages };
    });

    return newLike;
  }

  return { likePost, isPending };
}
