import { useState } from "react";
import { api } from "../../../trpc/react";
import useBibleStudyContext from "../context/use-bible-study-context";

export function useBibleStudyDeleteNote() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useBibleStudyContext();

  const { mutateAsync: deleteNoteMutation } =
    api.bibleStudy.deleteNote.useMutation();
  const utils = api.useUtils();

  async function deleteNote(noteId: string) {
    if (session == null) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteNoteMutation({ noteId });
      utils.bibleStudy.getNotes.setData(
        { sessionId: session.id },
        (prevNotes) => {
          if (prevNotes == null) {
            return [];
          } else {
            return prevNotes.filter((n) => n.id !== noteId);
          }
        },
      );
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, deleteNote };
}
