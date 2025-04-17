import {
  BibleStudyPostStatus,
  BibleStudyPostType,
  type BibleStudyPost,
} from "@prisma/client";
import { type MutationStatus } from "@tanstack/react-query";
import { type Editor } from "@tiptap/react";
import { debounce } from "lodash";
import { useEffect } from "react";
import useBibleStudyContext from "../../context/use-bible-study-context";
import useBibleStudyPostCreate from "./use-bible-study-post-create";
import useBibleStudyPostUpdate from "./use-bible-study-post-update";
import { usePostEditor } from "./use-post-editor";

export default function useBibleStudyPostSaveContentOnUpdate(
  post: BibleStudyPost | null | undefined,
): MutationStatus {
  const { session } = useBibleStudyContext();
  const editor = usePostEditor();

  const { createPost, status: createPostStatus } = useBibleStudyPostCreate();
  const { updatePost, status: updatePostStatus } = useBibleStudyPostUpdate();

  useEffect(() => {
    if (session == null || editor == null) {
      return;
    }

    const handleUpdate = debounce(async (updatedEditor: Editor) => {
      if (post == null) {
        await createPost({
          contentJson: updatedEditor.getJSON(),
          contentText: updatedEditor.getText(),
          type: BibleStudyPostType.TEXT,
          status: BibleStudyPostStatus.DRAFT,
          title: session.title,
          sessionId: session.id,
        });
      } else {
        await updatePost({
          postId: post.id,
          contentJson: updatedEditor.getJSON(),
          contentText: updatedEditor.getText(),
        });
      }
    }, 1000);

    editor.on("update", async ({ editor: updatedEditor }) => {
      await handleUpdate(updatedEditor);
    });

    return () => {
      editor.off("update");
    };
  }, [session, editor, post, createPost, updatePost]);

  return updatePostStatus === "idle" ? createPostStatus : updatePostStatus;
}
