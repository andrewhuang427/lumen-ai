import { useCallback } from "react";
import { type CreatePostInput } from "../../../../server/services/bible-study-post-service";
import { api } from "../../../../trpc/react";

export default function useBibleStudyPostCreate() {
  const {
    mutateAsync: createPostMutation,
    status,
    isPending,
  } = api.bibleStudyPost.createPost.useMutation();

  const utils = api.useUtils();

  const createPost = useCallback(
    async (input: CreatePostInput) => {
      // 1. create post
      const newPost = await createPostMutation(input);

      // 2. update post in local cache
      utils.bibleStudyPost.getTextPost.setData(
        { sessionId: input.sessionId },
        newPost,
      );

      return newPost;
    },
    [createPostMutation, utils],
  );

  return { createPost, status, isPending };
}
