import { type BibleBook, type BibleChapter } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { cn } from "../../lib/utils";
import { api } from "../../trpc/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

type Props = {
  book: BibleBook;
  minChapter?: number;
  selectedChapter: BibleChapter | null;
  onChapterChange: (chapter: BibleChapter) => void;
  className?: string;
};

export default function SelectBibleChapter({
  book,
  minChapter = 1,
  selectedChapter,
  onChapterChange,
  className,
}: Props) {
  const { data: chapters = [], isLoading } = api.bible.getChapters.useQuery({
    bookId: book.id,
  });

  const displayedChapters = useMemo(() => {
    return chapters.filter((chapter) => chapter.number >= minChapter);
  }, [chapters, minChapter]);

  function handleChapterChange(value: string) {
    const chapter = chapters.find((chapter) => chapter.id === value);
    if (chapter != null) {
      onChapterChange(chapter);
    }
  }

  return (
    <Select
      value={selectedChapter?.id}
      onValueChange={handleChapterChange}
      disabled={isLoading}
    >
      <SelectTrigger
        aria-label="Select a chapter"
        className={cn("shrink-0", className)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {selectedChapter?.number ?? "Chapter"}
      </SelectTrigger>
      <SelectContent className="overflow-y-auto max-md:max-h-64">
        {displayedChapters.map((chapter) => (
          <SelectItem key={chapter.id} value={chapter.id}>
            {chapter.number}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
