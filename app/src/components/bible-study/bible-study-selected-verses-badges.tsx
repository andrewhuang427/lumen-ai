import {
  type BibleBook,
  type BibleChapter,
  type BibleVerse,
} from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { Badge } from "../ui/badge";

type Props = {
  mergedVerses: BibleVerse[][];
  chapters: BibleChapter[];
  book: BibleBook;
  setSelectedVerses: Dispatch<SetStateAction<BibleVerse[]>>;
};

export default function BibleStudySelectedVersesBadges({
  mergedVerses,
  chapters,
  book,
  setSelectedVerses,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      {mergedVerses.map((verseChunk) => {
        const first = verseChunk[0];
        const last = verseChunk[verseChunk.length - 1];
        if (first == null) {
          return null;
        }

        const chapter = chapters.find((c) => c.id === first.chapter_id);
        if (chapter == null) {
          return null;
        }

        function handleRemove() {
          setSelectedVerses((prev) =>
            prev.filter((v) => !verseChunk.includes(v)),
          );
        }

        return (
          <Badge variant="default" key={first.id} onClick={handleRemove}>
            {book.name} {chapter.number}:{first.verse_number}
            {last != null && verseChunk.length > 1 && `-${last.verse_number}`}
          </Badge>
        );
      })}
    </div>
  );
}
