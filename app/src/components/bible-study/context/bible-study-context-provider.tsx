"use client";

import { type BibleVerse } from "@prisma/client";
import { type PropsWithChildren, useMemo, useState } from "react";
import { api } from "../../../trpc/react";
import { mergeVerses } from "../bible-study-utils";
import {
  BibleStudyContext,
  type BibleStudyContextType,
} from "./bible-study-context";

type Props = PropsWithChildren<{
  sessionId: string;
}>;

export default function BibleStudyContextProvider({
  children,
  sessionId,
}: Props) {
  const [selectedVerses, setSelectedVerses] = useState<BibleVerse[]>([]);

  const { data: session } = api.bibleStudy.getSession.useQuery(
    { sessionId },
    {
      throwOnError(error) {
        if (error.data?.code === "UNAUTHORIZED") {
          window.location.href = "/";
        }
        return true;
      },
    },
  );

  const { data: notes = [], isLoading: isLoadingNotes } =
    api.bibleStudy.getNotes.useQuery(
      { sessionId },
      { enabled: session != null },
    );

  const book = useMemo(() => {
    return session?.book ?? null;
  }, [session?.book]);

  const chapters = useMemo(() => {
    return session?.chapters ?? [];
  }, [session?.chapters]);

  const mergedVerses = useMemo(() => {
    return mergeVerses(selectedVerses, chapters);
  }, [selectedVerses, chapters]);

  const contextValue: BibleStudyContextType = useMemo(
    () => ({
      session: session ?? null,
      book,
      chapters,
      notes,
      selectedVerses,
      mergedVerses,
      isLoadingNotes,
      setSelectedVerses,
    }),
    [
      session,
      book,
      chapters,
      notes,
      selectedVerses,
      mergedVerses,
      isLoadingNotes,
    ],
  );

  return (
    <BibleStudyContext.Provider value={contextValue}>
      {children}
    </BibleStudyContext.Provider>
  );
}
