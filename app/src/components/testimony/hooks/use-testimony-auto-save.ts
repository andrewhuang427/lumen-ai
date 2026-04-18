import { type MutationStatus } from "@tanstack/react-query";
import { type Editor } from "@tiptap/react";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";
import { type Testimony } from "@prisma/client";
import { api } from "../../../trpc/react";
import { useTestimonyEditor } from "../context/use-testimony-editor-context";

export default function useTestimonyAutoSave(
  testimony: Testimony | null | undefined,
): MutationStatus {
  const editor = useTestimonyEditor();

  const { mutateAsync: createTestimony, status: createStatus } =
    api.testimony.createTestimony.useMutation();
  const { mutateAsync: updateTestimony, status: updateStatus } =
    api.testimony.updateTestimony.useMutation();

  const utils = api.useUtils();
  const pendingSaveRef = useRef(false);

  useEffect(() => {
    if (editor == null) {
      return;
    }

    const handleUpdate = debounce(async (updatedEditor: Editor) => {
      pendingSaveRef.current = false;
      const contentJson = updatedEditor.getJSON();
      const contentText = updatedEditor.getText();

      if (testimony == null) {
        return;
      } else {
        const updated = await updateTestimony({
          testimonyId: testimony.id,
          contentJson,
          contentText,
        });
        utils.testimony.getTestimony.setData(
          { testimonyId: testimony.id },
          updated,
        );
      }
    }, 1000);

    const updateListener = ({ editor: updatedEditor }: { editor: Editor }) => {
      pendingSaveRef.current = true;
      void handleUpdate(updatedEditor);
    };

    editor.on("update", updateListener);

    // Unsaved changes guard
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingSaveRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      editor.off("update", updateListener);
      handleUpdate.cancel();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editor, testimony, updateTestimony, createTestimony, utils]);

  return testimony == null ? createStatus : updateStatus;
}