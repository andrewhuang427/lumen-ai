import { useContext } from "react";
import { TestimonyEditorContext } from "./testimony-editor-context-provider";

export function useTestimonyEditor() {
  return useContext(TestimonyEditorContext);
}