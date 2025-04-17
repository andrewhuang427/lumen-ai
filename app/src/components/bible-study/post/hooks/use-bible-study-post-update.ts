import { useCallback } from "react";
import { type UpdatePostInput } from "../../../../server/services/bible-study-post-service";
import { api } from "../../../../trpc/react";

export default function useBibleStudyPostUpdate() {
  const { mutateAsync: updatePostMutation, status } =
    api.bibleStudyPost.updatePost.useMutation();

  const utils = api.useUtils();

  const updatePost = useCallback(
    async (input: UpdatePostInput) => {
      // 1. call update post mutation
      const updatedPost = await updatePostMutation(input);

      // 2. update post in local cache
      utils.bibleStudyPost.getPost.setData(
        { sessionId: updatedPost.session_id },
        updatedPost,
      );

      return updatedPost;
    },
    [updatePostMutation, utils],
  );

  return { updatePost, status };
}
