"use client";

import { type BibleBook, type BibleVersion } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { api } from "../../trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  version: BibleVersion;
  selectedBook: BibleBook | null;
  onBookChange: (book: BibleBook) => void;
  className?: string;
};

export default function SelectBibleBook({
  version,
  selectedBook,
  onBookChange,
  className,
}: Props) {
  const { data: books = [], isLoading } = api.bible.getBooks.useQuery({
    versionId: version.id,
  });

  function handleBookChange(value: string) {
    const book = books.find((book) => book.id === value);
    if (book != null) {
      onBookChange(book);
    }
  }

  return (
    <Select
      value={selectedBook?.id}
      onValueChange={handleBookChange}
      disabled={isLoading}
    >
      <SelectTrigger
        aria-label="Select a book"
        className={cn("w-36 shrink-0", className)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <SelectValue placeholder="Book" />
      </SelectTrigger>
      <SelectContent className="overflow-y-auto max-md:max-h-64">
        {books.map((book) => (
          <SelectItem key={book.id} value={book.id}>
            {book.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
