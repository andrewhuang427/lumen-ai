"use client";

import { motion } from "framer-motion";
import { useIsMobile } from "../../hooks/use-mobile";
import SelectBibleBook from "../bible/select-bible-book";
import SelectBibleChapter from "../bible/select-bible-chapter";
import { useBibleReaderContext } from "./use-bible-reader-context";

export default function BibleReaderHeader() {
  const {
    selectedVersion,
    selectedBook,
    selectedChapter,
    selectBook,
    selectChapter,
  } = useBibleReaderContext();
  const isMobile = useIsMobile();

  const showTitle = selectedBook == null || selectedChapter == null;
  const isSticky = selectedBook != null && selectedChapter != null;

  return (
    <motion.div
      className="z-20 flex w-full shrink-0 flex-col gap-8 bg-background p-4"
      initial={false}
      animate={{
        position: isSticky ? "sticky" : "absolute",
        top: isSticky ? 0 : "50%",
        y: isSticky ? 0 : "-50%",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {showTitle && (
        <div className="flex flex-col gap-2 text-center">
          <div className="flex items-center justify-center gap-2 text-2xl font-medium tracking-tight">
            Welcome to Lumen AI
          </div>
          <p className="text-sm text-muted-foreground">
            Select a book and chapter to read.
          </p>
        </div>
      )}
      <div className="flex items-center justify-center gap-2">
        {!isMobile && isSticky && <div className="w-96 grow" />}
        {selectedVersion != null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SelectBibleBook
              version={selectedVersion}
              selectedBook={selectedBook}
              onBookChange={selectBook}
            />
          </motion.div>
        )}
        {selectedBook != null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SelectBibleChapter
              book={selectedBook}
              selectedChapter={selectedChapter}
              onChapterChange={selectChapter}
            />
          </motion.div>
        )}
        {!isMobile && isSticky && <div className="w-96 grow" />}
      </div>
    </motion.div>
  );
}
