"use client";

import { BibleStudyNoteType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Quote, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";
import { usePulseAnimation } from "../../hooks/use-pulse-animation";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { getVerseId } from "../utils/bible-utils";
import {
  calculateTooltipPosition,
  isElementInViewport,
  type VersesPosition,
} from "../utils/tooltip-positioning";
import BibleStudySplitVersesDialog from "./bible-study-split-verses-dialog";
import { mergeVerses } from "./bible-study-utils";
import BibleStudyVerseIndicator, {
  getPulseAnimationClass,
} from "./bible-study-verse-indicator";
import { useBibleStudyContentScrollableContext } from "./context/use-bible-study-content-scrollable-context";
import useBibleStudyContext from "./context/use-bible-study-context";
import { useBibleStudyVerseNotes } from "./hooks/use-bible-study-verse-notes";
import BibleStudyShareQuoteDialog from "./share/bible-study-share-quote-dialog";

export default function BibleStudySelectedVersesTooltip() {
  const [isSplitVersesDialogOpen, setIsSplitVersesDialogOpen] = useState(false);
  const [noteType, setNoteType] = useState<BibleStudyNoteType | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [areVersesInView, setAreVersesInView] = useState(true);
  const [versesPosition, setVersesPosition] =
    useState<VersesPosition>("visible");

  const { session, book, chapters, selectedVerses, setSelectedVerses } =
    useBibleStudyContext();
  const { createNoteFromVerses, isLoading } = useBibleStudyVerseNotes();

  const scrollableRef = useBibleStudyContentScrollableContext();
  const lastPositionRef = useRef({ top: 0, left: 0 });

  const isMobile = useIsMobile();

  const showPulse = usePulseAnimation({
    trigger: !areVersesInView,
  });

  const mergedVerses = useMemo(
    () => mergeVerses(selectedVerses, chapters),
    [selectedVerses, chapters],
  );

  useEffect(() => {
    if (selectedVerses.length === 0) {
      return;
    }

    function handleUpdatePosition() {
      const firstVerseId = selectedVerses[0]?.id;
      if (!firstVerseId) {
        return;
      }
      const verseElement = document.getElementById(getVerseId(firstVerseId));
      if (!verseElement) {
        return;
      }
      const scrollable = scrollableRef?.current;
      if (!scrollable) {
        return;
      }

      const verseRect = verseElement.getBoundingClientRect();
      const scrollableRect = scrollable.getBoundingClientRect();
      const { inView, position } = isElementInViewport(
        verseRect,
        scrollableRect,
      );

      if (inView !== areVersesInView) {
        setAreVersesInView(inView);
      }
      if (position !== versesPosition) {
        setVersesPosition(position);
      }

      const tooltipPos = calculateTooltipPosition(
        verseRect,
        scrollableRect,
        inView,
      );

      lastPositionRef.current = tooltipPos;
      setTooltipPosition(tooltipPos);
    }

    handleUpdatePosition();
    const scrollable = scrollableRef?.current;
    if (scrollable) {
      scrollable.addEventListener("scroll", handleUpdatePosition);
      window.addEventListener("resize", handleUpdatePosition);

      return () => {
        scrollable.removeEventListener("scroll", handleUpdatePosition);
        window.removeEventListener("resize", handleUpdatePosition);
      };
    }
  }, [selectedVerses, scrollableRef, areVersesInView, versesPosition]);

  const handleClearVerses = () => {
    setSelectedVerses([]);
  };

  const handleCreateNote = async (type: BibleStudyNoteType) => {
    if (session === null || book === null) {
      return;
    }

    if (selectedVerses.length === 1) {
      await createNoteFromVerses(type, mergedVerses);
      handleClearVerses();
    } else {
      setIsSplitVersesDialogOpen(true);
      setNoteType(type);
    }
  };

  if (!book) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {selectedVerses.length > 0 && (
          <motion.div
            className={`fixed z-50 flex items-center justify-between gap-2 rounded-lg bg-sidebar/95 px-3 py-2 text-sm text-muted-foreground shadow-lg backdrop-blur-sm transition-all duration-300 ${!areVersesInView ? "ring-2 ring-amber-400/70" : ""} ${getPulseAnimationClass(showPulse)} `}
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              transform: "translateX(-50%)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              opacity: { duration: 0.15 },
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <BibleStudyVerseIndicator
                  areVersesInView={areVersesInView}
                  versesPosition={versesPosition}
                />
                {selectedVerses.length > 1 && (
                  <Badge variant="secondary" className="mr-1">
                    {selectedVerses.length} verses
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => handleCreateNote(BibleStudyNoteType.QUOTE)}
                >
                  <Quote size={16} className="text-green-500" />
                  {!isMobile && "Quote"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() =>
                    handleCreateNote(BibleStudyNoteType.UNDERSTANDING)
                  }
                >
                  <Lightbulb size={16} className="text-yellow-500" />
                  {!isMobile && "Understand"}
                </Button>
                <BibleStudyShareQuoteDialog />
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={handleClearVerses}
                >
                  <X size={16} />
                  {!isMobile && "Clear"}
                </Button>
              </div>
              {!isMobile && (
                <p className="ml-1 mt-1 text-xs italic text-muted-foreground/70">
                  {selectedVerses.length > 1
                    ? `Create a quote or note from these ${selectedVerses.length} verses`
                    : "Create a quote or note from this verse"}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <BibleStudySplitVersesDialog
        open={isSplitVersesDialogOpen}
        onOpenChange={setIsSplitVersesDialogOpen}
        noteType={noteType}
        onComplete={() => handleClearVerses()}
      />
    </>
  );
}
