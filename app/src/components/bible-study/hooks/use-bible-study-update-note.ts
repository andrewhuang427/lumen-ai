"use client";

import { useCallback, useState } from "react";
import { type UpdateBibleStudyNoteType } from "../../../server/utils/bible-note-utils";
import { api } from "../../../trpc/react";
import useBibleStudyContext from "../context/use-bible-study-context";

export function useBibleStudyUpdateNote() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useBibleStudyContext();

  const { mutateAsync: updateNoteMutation } =
    api.bibleStudy.updateNote.useMutation();
  const utils = api.useUtils();

  const updateNote = useCallback(
    async (input: UpdateBibleStudyNoteType) => {
      if (session === null) {
        return;
      }

      try {
        setIsLoading(true);
        const updatedNote = await updateNoteMutation(input);
        utils.bibleStudy.getNotes.setData(
          { sessionId: session.id },
          (prevNotes) => {
            if (prevNotes == null) {
              return [];
            }
            return prevNotes.map((note) =>
              note.id === input.id ? updatedNote : note,
            );
          },
        );
        return updatedNote;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [session, utils.bibleStudy.getNotes, updateNoteMutation],
  );

  return { updateNote, isLoading };
}
