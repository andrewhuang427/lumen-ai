import { type BibleStudyPost } from "@prisma/client";
import { type JSONContent } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { usePostEditor } from "./use-post-editor";

export default function useBibleStudyPostInitEditor(
  post: BibleStudyPost | null | undefined,
) {
  const editor = usePostEditor();
  const didInitEditorContent = useRef(false);

  useEffect(() => {
    if (post != null && editor != null && !didInitEditorContent.current) {
      didInitEditorContent.current = true;
      const content = post.content_json as JSONContent;
      editor.commands.setContent(content, true);
    }
  }, [post, editor]);
}
