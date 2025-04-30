import { AlertCircle } from "lucide-react";
import React, { Fragment } from "react";
import { cn } from "../../../../lib/utils";
import { type BibleStudyNoteVerseGroupType } from "../../../../server/utils/bible-note-utils";
import Grip from "../../../grip";
import { Card } from "../../../ui/card";
import useBibleStudyEmphasizeVerses from "../../hooks/use-bible-study-emphasize-verses";

const NoteCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "flex flex-col gap-2 rounded-md bg-sidebar p-4 shadow-none",
      className,
    )}
    {...props}
  />
));

NoteCard.displayName = "NoteCard";

const NoteCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 text-sm", className)}
    {...props}
  >
    <Grip />
    {props.children}
  </div>
));

NoteCardHeader.displayName = "NoteCardHeader";

const NoteCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
));

NoteCardContent.displayName = "NoteCardContent";

type NoteVerseProps = {
  verses: BibleStudyNoteVerseGroupType[];
};

const NoteVerse = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & NoteVerseProps
>(({ className, verses, ...props }, ref) => {
  const { emphasizeVerses } = useBibleStudyEmphasizeVerses();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 rounded-sm bg-muted p-4 font-serif text-xs",
        "cursor-pointer transition-all duration-200 hover:bg-muted/75 active:scale-95",
        className,
      )}
      onClick={() => emphasizeVerses(verses)}
      {...props}
    >
      {verses.length === 0 && (
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <div className="text-xs font-medium text-yellow-500">
            Add verses to your note by clicking the edit icon
          </div>
        </div>
      )}
      {verses.map((verseGroup, index) => {
        const firstVerse = verseGroup[0];
        const lastVerse = verseGroup[verseGroup.length - 1];

        if (!firstVerse) {
          return null;
        }

        const name = `${firstVerse.book} ${firstVerse.chapter}:${firstVerse.verse}${lastVerse && verseGroup.length > 1 ? `-${lastVerse.verse}` : ""}`;

        return (
          <div key={index} className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground">{name}</div>
            <div className="whitespace-pre-wrap">
              {verseGroup.map((v, verseIndex) => {
                const isFirstVerse = verseIndex === 0;
                const isLastVerse = verseIndex === verseGroup.length - 1;

                let displayedText = v.text;
                if (isFirstVerse) {
                  displayedText = displayedText.trimStart();
                }
                if (isLastVerse) {
                  displayedText = displayedText.trimEnd();
                }

                return (
                  <Fragment key={v.id}>
                    <span className="mr-1 text-blue-500">{v.verse}</span>
                    <span className="whitespace-pre-wrap">{displayedText}</span>
                  </Fragment>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

NoteVerse.displayName = "NoteVerse";

export { NoteCard, NoteCardContent, NoteCardHeader, NoteVerse };
