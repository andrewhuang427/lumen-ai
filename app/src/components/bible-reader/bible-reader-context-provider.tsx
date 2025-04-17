"use client";

import {
  type BibleBook,
  type BibleChapter,
  type BibleVersion,
} from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "../../trpc/react";
import useAuth from "../auth/use-auth";
import {
  BibleReaderContext,
  type BibleReaderContextType,
} from "./bible-reader-context";
import { type ReadingLocation } from "../../server/services/user-preferences-service";

type Props = PropsWithChildren<{
  defaultReadingLocation: ReadingLocation;
}>;

export default function BibleReaderContextProvider({
  children,
  defaultReadingLocation,
}: Props) {
  const [version, setVersion] = useState<BibleVersion | null>(
    defaultReadingLocation.version,
  );
  const [book, setBook] = useState<BibleBook | null>(
    defaultReadingLocation.book,
  );
  const [chapter, setChapter] = useState<BibleChapter | null>(
    defaultReadingLocation.chapter,
  );

  const { user } = useAuth();
  const pathname = usePathname();
  const params = useSearchParams();
  const bookNameParam = params.get("book");
  const chapterNumberParam = params.get("chapter");

  const didSetInitialSearchParams = useRef(false);

  const { data: versions = [] } = api.bible.getVersions.useQuery();
  const { data: books = [] } = api.bible.getBooks.useQuery(
    { versionId: version?.id ?? "" },
    { enabled: version != null },
  );
  const { data: chapters = [] } = api.bible.getChapters.useQuery(
    { bookId: book?.id ?? "" },
    { enabled: book != null },
  );
  const { data: chapterContent = null, isLoading: isChapterContentLoading } =
    api.bible.getChapter.useQuery(
      { chapterId: chapter?.id ?? "" },
      { enabled: chapter != null },
    );

  const { mutate: updateReadingLocation } =
    api.user.updateReadingLocation.useMutation();

  const setSearchParams = useCallback(
    (book: BibleBook, chapter: BibleChapter | null) => {
      const searchParams = new URLSearchParams(params.toString());
      searchParams.set("book", book.name);
      if (chapter == null) {
        searchParams.delete("chapter");
      } else {
        searchParams.set("chapter", chapter.number.toString());
      }
      const newPath = `${pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, "", newPath);
    },
    [params, pathname],
  );

  const selectBook = useCallback(
    (book: BibleBook) => {
      setBook(book);
      setChapter(null);
      setSearchParams(book, null);
    },
    [setSearchParams],
  );

  const selectChapter = useCallback(
    (chapter: BibleChapter) => {
      if (book == null) {
        return;
      }
      setChapter(chapter);
      setSearchParams(book, chapter);
    },
    [book, setSearchParams],
  );

  const advanceChapter = useCallback(
    (direction: "next" | "previous") => {
      if (chapter == null) {
        return;
      }
      const nextChapter = chapters.find(
        (c) => c.number === chapter.number + (direction === "next" ? 1 : -1),
      );
      if (nextChapter != null) {
        selectChapter(nextChapter);
      }
    },
    [chapters, chapter, selectChapter],
  );

  // Set search params from the user's last visited reading location
  useEffect(() => {
    if (
      didSetInitialSearchParams.current ||
      pathname !== "/" ||
      defaultReadingLocation.book == null ||
      defaultReadingLocation.chapter == null ||
      bookNameParam != null ||
      chapterNumberParam != null
    ) {
      return;
    }
    didSetInitialSearchParams.current = true;
    setSearchParams(
      defaultReadingLocation.book,
      defaultReadingLocation.chapter,
    );
  }, [
    pathname,
    defaultReadingLocation,
    bookNameParam,
    chapterNumberParam,
    setSearchParams,
  ]);

  // Set the first bible version as the default version if no version is selected
  useEffect(() => {
    const firstVersion = versions[0];
    if (version == null && firstVersion != null) {
      setVersion(firstVersion);
    }
  }, [versions, version]);

  // Set the selected book from the search params
  useEffect(() => {
    if (bookNameParam == null) {
      return;
    }
    const updatedBook = books.find((b) => b.name === bookNameParam);
    setBook(updatedBook ?? null);
  }, [bookNameParam, books]);

  // Set the selected chapter from the search params
  useEffect(() => {
    if (chapterNumberParam == null) {
      return;
    }
    const numChapter = Number(chapterNumberParam);
    const updatedChapter = chapters.find((c) => c.number === numChapter);
    setChapter(updatedChapter ?? null);
  }, [chapterNumberParam, chapters]);

  // Update the user's last visited reading location in the database
  useEffect(() => {
    function handleUpdateReadingLocation() {
      if (user == null || version == null || book == null || chapter == null) {
        return;
      }
      updateReadingLocation({
        versionId: version.id,
        bookId: book.id,
        chapterId: chapter.id,
      });
    }
    handleUpdateReadingLocation();
  }, [user, version, book, chapter, updateReadingLocation]);

  const contextValue: BibleReaderContextType = useMemo(() => {
    const hasNextChapter = chapter != null && chapter.number < chapters.length;
    const hasPreviousChapter = chapter != null && chapter.number > 1;

    return {
      versions,
      books,
      chapters,
      selectedVersion: version,
      selectedBook: book,
      selectedChapter: chapter,
      selectedChapterContent: chapterContent,
      hasPreviousChapter,
      hasNextChapter,
      isChapterContentLoading,
      selectVersion: setVersion,
      selectBook,
      selectChapter,
      nextChapter: () => advanceChapter("next"),
      previousChapter: () => advanceChapter("previous"),
    };
  }, [
    versions,
    books,
    chapters,
    version,
    book,
    chapter,
    chapterContent,
    isChapterContentLoading,
    selectBook,
    selectChapter,
    advanceChapter,
  ]);

  return (
    <BibleReaderContext.Provider value={contextValue}>
      {children}
    </BibleReaderContext.Provider>
  );
}
