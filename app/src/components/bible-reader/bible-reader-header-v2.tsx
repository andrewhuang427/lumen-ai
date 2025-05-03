"use client";

import { motion } from "framer-motion";
import { useIsMobile } from "../../hooks/use-mobile";
import SelectBibleBook from "../bible/select-bible-book";
import SelectBibleChapter from "../bible/select-bible-chapter";
import SelectBibleVersion from "../bible/select-bible-version";
import BibleReaderHeaderActivityStats from "./bible-reader-header-activity-stats";
import { useBibleReaderContext } from "./use-bible-reader-context";

export default function BibleReaderHeaderV2() {
  const {
    selectedVersion,
    selectedBook,
    selectedChapter,
    selectVersion,
    selectBook,
    selectChapter,
  } = useBibleReaderContext();
  const isMobile = useIsMobile();

  const showTitle = selectedBook == null || selectedChapter == null;

  return (
    <div className="relative grid w-full shrink-0 grid-cols-3 gap-4 p-4 md:p-6">
      <div className="col-span-1" />
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SelectBibleVersion
              selectedVersion={selectedVersion}
              onVersionChange={selectVersion}
            />
          </motion.div>
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
        </div>
        {!isMobile && showTitle && (
          <p className="text-sm text-muted-foreground">
            Select a book and chapter.
          </p>
        )}
      </div>
      <div className="flex grow items-center justify-end">
        <BibleReaderHeaderActivityStats />
      </div>
    </div>
  );
}
