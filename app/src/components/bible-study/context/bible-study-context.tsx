import { type BibleBook, type BibleVerse } from "@prisma/client";
import { createContext, type Dispatch, type SetStateAction } from "react";
import { type TypedBibleStudyNote } from "../../../server/utils/bible-note-utils";
import {
  type BibleChapterWithSections,
  type EnrichedBibleStudySession,
} from "../../../server/utils/bible-utils";

export type BibleStudyContextType = {
  session: EnrichedBibleStudySession | null;
  book: BibleBook | null;
  chapters: BibleChapterWithSections[];
  notes: TypedBibleStudyNote[];
  selectedVerses: BibleVerse[];
  mergedVerses: BibleVerse[][];
  isLoadingNotes: boolean;
  setSelectedVerses: Dispatch<SetStateAction<BibleVerse[]>>;
};

export const BibleStudyContext = createContext<BibleStudyContextType>({
  session: null,
  book: null,
  chapters: [],
  notes: [],
  selectedVerses: [],
  mergedVerses: [],
  isLoadingNotes: false,
  setSelectedVerses: () => {},
});
