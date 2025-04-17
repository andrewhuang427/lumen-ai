import { BibleStudyNoteType, type BibleVerse } from "@prisma/client";
import { useState } from "react";
import useBibleStudyContext from "../context/use-bible-study-context";
import { useBibleStudyCreateNote } from "./use-bible-study-create-note";
import { toNoteVerses } from "../bible-study-utils";

export function useBibleStudyVerseNotes() {
  const { session, book, chapters } = useBibleStudyContext();
  const { createNote } = useBibleStudyCreateNote();
  const [isLoading, setIsLoading] = useState(false);

  async function createNoteFromVerses(
    type: BibleStudyNoteType,
    verseGroups: BibleVerse[][],
  ) {
    if (session == null || book == null) {
      return;
    }

    try {
      setIsLoading(true);
      const noteVerses = toNoteVerses(verseGroups, chapters, book);
      if (type === BibleStudyNoteType.QUOTE) {
        await createNote({
          type: BibleStudyNoteType.QUOTE,
          sessionId: session.id,
          data: {
            verses: noteVerses,
            commentary: "",
          },
        });
      } else if (type === BibleStudyNoteType.UNDERSTANDING) {
        await createNote({
          type: BibleStudyNoteType.UNDERSTANDING,
          sessionId: session.id,
          data: {
            verses: noteVerses,
            messages: [],
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    createNoteFromVerses,
    isLoading,
  };
}
