import { useCallback } from "react";
import { type CreatePostInput } from "../../../../server/api/routers/bible-study-post";
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
      utils.bibleStudyPost.getPost.setData(
        { sessionId: input.sessionId },
        newPost,
      );

      return newPost;
    },
    [createPostMutation, utils],
  );

  return { createPost, status, isPending };
}
