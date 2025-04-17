import { useContext } from "react";
import { PostEditorContext } from "../post-editor-context-provider";

export function usePostEditor() {
  return useContext(PostEditorContext);
}
