"use client";

import { Loader2 } from "lucide-react";
import BibleChapter from "../bible/bible-chapter";
import { useBibleReaderContext } from "./use-bible-reader-context";

export default function BibleReaderContent() {
  const {
    selectedBook,
    selectedChapter,
    selectedChapterContent,
    isChapterContentLoading,
  } = useBibleReaderContext();

  if (selectedBook == null || selectedChapter == null) {
    return null;
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex justify-center px-4 pb-12 pt-8 md:pb-24 md:pt-16">
        <div className="max-w-2xl">
          {isChapterContentLoading && (
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-sm text-muted-foreground">
                Loading {selectedBook?.name} {selectedChapter?.number}
              </div>
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          {!isChapterContentLoading && selectedChapterContent != null && (
            <BibleChapter
              book={selectedBook}
              chapter={selectedChapterContent}
              isSelectTextEnabled={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
