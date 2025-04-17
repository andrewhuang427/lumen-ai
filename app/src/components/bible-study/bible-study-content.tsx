"use client";

import { Loader2, MousePointerClick } from "lucide-react";
import { Fragment } from "react";
import BibleChapter from "../bible/bible-chapter";
import { Separator } from "../ui/separator";
import BibleStudySelectedVersesTooltip from "./bible-study-selected-verses-tooltip";
import { useBibleStudyContentScrollableContext } from "./context/use-bible-study-content-scrollable-context";
import useBibleStudyContext from "./context/use-bible-study-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function BibleStudyContent() {
  const { session, book, chapters, selectedVerses, setSelectedVerses } =
    useBibleStudyContext();
  const scrollableRef = useBibleStudyContentScrollableContext();

  return (
    <div className="relative min-h-0 flex-1">
      {session == null || book == null ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <div className="text-sm text-muted-foreground">
              Loading Bible text...
            </div>
          </div>
        </div>
      ) : (
        <>
          <BibleStudySelectedVersesTooltip />
          <div className="absolute right-4 top-4 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 rounded-md border bg-background/90 px-2 py-1 text-xs shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-background hover:text-primary">
                    <MousePointerClick size={11} className="text-primary" />
                    <span>Select Verses</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="end"
                  className="max-w-[200px]"
                >
                  <p className="text-xs">
                    Click on any verse text to select it for notes and quotes
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div ref={scrollableRef} className="h-full overflow-y-auto">
            <div className="flex justify-center px-4 pb-12 pt-8 md:pb-16 md:pt-16">
              <div className="flex max-w-2xl flex-col gap-8 md:gap-12">
                {chapters.map((chapter, index) => {
                  return (
                    <Fragment key={chapter.id}>
                      <BibleChapter
                        book={book}
                        chapter={chapter}
                        isSelectTextEnabled={true}
                        selectedVerses={selectedVerses}
                        setSelectedVerses={setSelectedVerses}
                      />
                      {index !== chapters.length - 1 && <Separator />}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
