"use client";
import { type BibleBook, type BibleChapter } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import { api } from "../../trpc/react";
import { useBibleReaderContext } from "../bible-reader/use-bible-reader-context";
import SelectBibleBook from "../bible/select-bible-book";
import SelectBibleChapter from "../bible/select-bible-chapter";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function BibleStudyCreateDialog({
  trigger,
  open,
  onOpenChange,
}: Props) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const [book, setBook] = useState<BibleBook | null>(null);
  const [start, setStart] = useState<BibleChapter | null>(null);
  const [end, setEnd] = useState<BibleChapter | null>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { selectedVersion, selectedBook, selectedChapter } =
    useBibleReaderContext();

  const { mutateAsync: createSession } =
    api.bibleStudy.createSession.useMutation();
  const utils = api.useUtils();

  const router = useRouter();

  function handleSelectBook(book: BibleBook) {
    setBook(book);
    setStart(null);
    setEnd(null);
  }

  function handleSelectStartChapter(chapter: BibleChapter) {
    setStart(chapter);
    setEnd(null);
  }

  function handleSelectEndChapter(chapter: BibleChapter) {
    setEnd(chapter);
  }

  async function handleCreate() {
    if (book == null || start == null) {
      return;
    }

    try {
      setIsLoading(true);
      const session = await createSession({
        title: `${book.name} ${start.number}${
          end?.number ? ` - ${end.number}` : ""
        }`,
        description: description === "" ? undefined : description,
        bookId: book.id,
        startChapterId: start.id,
        endChapterId: end?.id,
      });
      await utils.bibleStudy.getSessions.invalidate();
      router.push(`/study/${session.id}`);
    } finally {
      setIsLoading(false);
      onOpenChange?.(false);
      setIsOpenInternal(false);
      setBook(null);
      setStart(null);
      setEnd(null);
      setDescription("");
    }
  }

  useEffect(() => {
    setBook(selectedBook);
    setStart(selectedChapter);
  }, [selectedBook, selectedChapter]);

  return (
    <Dialog
      open={open ?? isOpenInternal}
      onOpenChange={(updatedOpen) => {
        onOpenChange?.(updatedOpen);
        setIsOpenInternal(updatedOpen);
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? <Button>Start a Bible study</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Bible Study</DialogTitle>
          <DialogDescription className="max-w-sm">
            Create a Bible study by selecting a book, start chapter, and end
            chapter.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 flex flex-col gap-4">
          <div className="grid min-h-8 grid-cols-4 items-center gap-4">
            <Label className="text-right text-sm font-medium">Book</Label>
            {selectedVersion != null && (
              <SelectBibleBook
                version={selectedVersion}
                selectedBook={book}
                onBookChange={handleSelectBook}
                className="col-span-3 w-full"
              />
            )}
          </div>
          <div className="grid min-h-8 grid-cols-4 items-center gap-4">
            <Label className="text-right text-sm font-medium">
              Start Chapter
            </Label>
            {book != null ? (
              <SelectBibleChapter
                book={book}
                selectedChapter={start}
                onChapterChange={handleSelectStartChapter}
                className="col-span-3 w-48"
              />
            ) : (
              <div className="col-span-3 text-sm text-muted-foreground">
                Select a book
              </div>
            )}
          </div>
          <div className="grid min-h-8 grid-cols-4 items-center gap-4">
            <div className="flex flex-col gap-1 text-right">
              <Label className="text-sm font-medium">End Chapter</Label>
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
            {book != null && start != null ? (
              <SelectBibleChapter
                book={book}
                selectedChapter={end}
                minChapter={(start?.number ?? 1) + 1}
                onChapterChange={handleSelectEndChapter}
                className="col-span-3 w-48"
              />
            ) : (
              <div className="col-span-3 text-sm text-muted-foreground">
                Select a book and start chapter
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex flex-col gap-1 text-right">
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
            <Textarea
              placeholder="Description"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 min-h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={isLoading || book == null || start == null}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
