"use client";

import {
  type BibleBook,
  type BibleChapter,
  type BibleVersion,
} from "@prisma/client";
import { createContext } from "react";
import { type BibleChapterWithSections } from "../../server/utils/bible-utils";

export type BibleReaderContextType = {
  versions: BibleVersion[];
  books: BibleBook[];
  chapters: BibleChapter[];
  selectedVersion: BibleVersion | null;
  selectedBook: BibleBook | null;
  selectedChapter: BibleChapter | null;
  selectedChapterContent: BibleChapterWithSections | null;
  hasPreviousChapter: boolean;
  hasNextChapter: boolean;
  isChapterContentLoading: boolean;
  selectVersion: (version: BibleVersion | null) => void;
  selectBook: (book: BibleBook) => void;
  selectChapter: (chapter: BibleChapter) => void;
  nextChapter: () => void;
  previousChapter: () => void;
};

export const BibleReaderContext = createContext<BibleReaderContextType>({
  versions: [],
  books: [],
  chapters: [],
  selectedVersion: null,
  selectedBook: null,
  selectedChapter: null,
  selectedChapterContent: null,
  hasPreviousChapter: false,
  hasNextChapter: false,
  isChapterContentLoading: false,
  selectVersion: () => {},
  selectBook: () => {},
  selectChapter: () => {},
  nextChapter: () => {},
  previousChapter: () => {},
});
