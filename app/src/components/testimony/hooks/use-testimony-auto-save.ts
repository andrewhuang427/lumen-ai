import { type MutationStatus } from "@tanstack/react-query";
import { type Editor } from "@tiptap/react";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";
import { type Testimony } from "@prisma/client";
import { api } from "../../../trpc/react";
import { useToast } from "../../../hooks/use-toast";
import { useTestimonyEditor } from "../context/use-testimony-editor-context";

export default function useTestimonyAutoSave(
  testimony: Testimony | null | undefined,
): MutationStatus {
  const editor = useTestimonyEditor();
  const { toast } = useToast();

  const { mutateAsync: updateTestimony, status: updateStatus } =
    api.testimony.updateTestimony.useMutation();

  const utils = api.useUtils();
  const pendingSaveRef = useRef(false);
  const testimonyRef = useRef(testimony);
  const updateTestimonyRef = useRef(updateTestimony);
  const utilsRef = useRef(utils);

  useEffect(() => {
    testimonyRef.current = testimony;
    updateTestimonyRef.current = updateTestimony;
    utilsRef.current = utils;
  }, [testimony, updateTestimony, utils]);

  useEffect(() => {
    if (editor == null) {
      return;
    }

    const handleUpdate = debounce(async (updatedEditor: Editor) => {
      pendingSaveRef.current = false;
      const contentJson = updatedEditor.getJSON();
      const contentText = updatedEditor.getText();

      const currentTestimony = testimonyRef.current;
      if (currentTestimony == null) {
        return;
      }

      try {
        const updated = await updateTestimonyRef.current({
          testimonyId: currentTestimony.id,
          contentJson,
          contentText,
        });
        utilsRef.current.testimony.getTestimony.setData(
          { testimonyId: currentTestimony.id },
          updated,
        );
      } catch {
        toast({
          title: "Failed to save",
          description: "Your changes could not be saved.",
          variant: "destructive",
        });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, toast]);

  return updateStatus;
}
