"use client";

import { useState } from "react";
import {
  type CreateBibleStudyNoteType,
  type TypedBibleStudyNote,
} from "../../../server/utils/bible-note-utils";
import { api } from "../../../trpc/react";
import { getNoteId } from "../bible-study-utils";
import useBibleStudyContext from "../context/use-bible-study-context";
import useBibleStudyNotesPanelScrollableContext from "../notes/context/use-bible-study-notes-panel-scrollable-context";

export function useBibleStudyCreateNote() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useBibleStudyContext();
  const scrollableRef = useBibleStudyNotesPanelScrollableContext();

  const { mutateAsync: createNoteMutation } =
    api.bibleStudy.createNote.useMutation();
  const utils = api.useUtils();

  async function createNote(
    input: CreateBibleStudyNoteType,
    scrollToNote = true,
  ): Promise<TypedBibleStudyNote | null> {
    if (session == null) {
      return null;
    }

    setIsLoading(true);
    try {
      const note = await createNoteMutation(input);
      // Update the notes in the cache
      utils.bibleStudy.getNotes.setData(
        { sessionId: session.id },
        (prevNotes) => {
          if (prevNotes == null) {
            return [];
          } else if (note == null) {
            return prevNotes;
          } else {
            return [...prevNotes, note];
          }
        },
      );

      if (scrollToNote) {
        // Automatically scroll to the new note after rendering
        requestAnimationFrame(() => {
          if (note == null) {
            return;
          }
          const noteId = getNoteId(note.id);
          const noteElement = document.getElementById(noteId);
          if (noteElement == null) {
            return;
          }
          scrollableRef?.current?.scrollTo({
            top: noteElement?.offsetTop,
            behavior: "smooth",
          });
        });
      }

      return note;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    createNote,
    isLoading,
  };
}
