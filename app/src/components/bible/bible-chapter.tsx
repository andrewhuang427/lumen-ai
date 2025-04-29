import {
  type BibleBook as BibleBookType,
  type BibleVerse as BibleVerseType,
} from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { type BibleChapterWithSections } from "../../server/utils/bible-utils";
import BibleVerse from "./bible-verse";
import { cn } from "../../lib/utils";

type Props = {
  book: BibleBookType;
  chapter: BibleChapterWithSections;
  isSelectTextEnabled?: boolean;
  selectedVerses?: BibleVerseType[];
  size?: "sm" | "md";
  setSelectedVerses?: Dispatch<SetStateAction<BibleVerseType[]>>;
};

export default function BibleChapter({
  book,
  chapter,
  isSelectTextEnabled = false,
  selectedVerses = [],
  size = "md",
  setSelectedVerses = () => {},
}: Props) {
  function handleSelectVerse(verse: BibleVerseType) {
    setSelectedVerses((prev) => {
      if (prev.includes(verse)) {
        return prev.filter((v) => v.id !== verse.id);
      }
      return [...prev, verse];
    });
  }

  return (
    <div className="flex flex-col gap-4 font-serif">
      <div className="flex items-center gap-2 border-b pb-4">
        <h2 className="grow text-xl font-medium tracking-wide text-foreground">
          {book.name} {chapter.number}
        </h2>
      </div>
      {chapter?.sections.map((section) => (
        <div key={section.heading} className="flex flex-col gap-2">
          <h1
            className={cn(
              "font-medium text-muted-foreground",
              size === "sm" ? "text-sm" : "text-base",
            )}
          >
            {section.heading}
          </h1>
          <div>
            {section.verses.map((verse) => (
              <BibleVerse
                key={verse.verse_number}
                verse={verse}
                isSelectTextEnabled={isSelectTextEnabled}
                isSelected={selectedVerses.includes(verse)}
                onSelect={handleSelectVerse}
                size={size}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
