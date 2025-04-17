"use client";

import { useState } from "react";
import { api } from "../../../trpc/react";
import useBibleStudyContext from "../context/use-bible-study-context";

export default function useBibleStudyGetNote() {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useBibleStudyContext();
  const utils = api.useUtils();

  async function getNote(noteId: string) {
    if (session == null) {
      return null;
    }

    try {
      setIsLoading(true);
      const note = await utils.bibleStudy.getNote.fetch({ noteId });
      utils.bibleStudy.getNotes.setData({ sessionId: session.id }, (prev) => {
        if (prev == null) {
          return [];
        }
        return prev.map((n) => (n.id === noteId ? note : n));
      });
      return note;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return { getNote, isLoading };
}
