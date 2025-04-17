import { type BibleVerse } from "@prisma/client";
import { Loader2, Pencil } from "lucide-react";
import {
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { type BibleStudyNoteVerseGroupType } from "../../../../server/utils/bible-note-utils";
import BibleChapter from "../../../bible/bible-chapter";
import { Button, type ButtonProps } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import BibleStudySelectedVersesBadges from "../../bible-study-selected-verses-badges";
import {
  mergeVerses,
  toNoteVerses,
  toSelectedVerses,
} from "../../bible-study-utils";
import useBibleStudyContext from "../../context/use-bible-study-context";

type Props = {
  initialVerses: BibleStudyNoteVerseGroupType[];
  isUpdating: boolean;
  onUpdate: (verses: BibleStudyNoteVerseGroupType[]) => Promise<void>;
  buttonProps?: ButtonProps & { children?: ReactNode };
  title?: string;
  description?: string;
};

export default function BibleStudyNoteEditVersesButton({
  initialVerses,
  isUpdating,
  onUpdate,
  buttonProps,
  title = "Edit verses",
  description = "Add verses to your note by clicking on the text in the Bible.",
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<BibleVerse[]>([]);

  const { chapters, book } = useBibleStudyContext();

  const mergedVerses = useMemo(
    () => mergeVerses(selectedVerses, chapters),
    [selectedVerses, chapters],
  );

  function handleOpen() {
    setOpen(true);
    setSelectedVerses(toSelectedVerses(initialVerses, chapters));
  }

  async function handleSave() {
    if (book == null) {
      return;
    }

    const mergedVerses = mergeVerses(selectedVerses, chapters);
    const updatedNoteVerses = toNoteVerses(mergedVerses, chapters, book);
    await onUpdate(updatedNoteVerses);
    setOpen(false);
  }

  if (book == null) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleOpen}
          className="h-8 w-8"
          {...buttonProps}
        >
          {buttonProps?.children ?? <Pencil />}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {mergedVerses.length > 0 && (
            <BibleStudySelectedVersesBadges
              mergedVerses={mergedVerses}
              chapters={chapters}
              book={book}
              setSelectedVerses={setSelectedVerses}
            />
          )}
        </DialogHeader>
        <BibleContent
          selectedVerses={selectedVerses}
          setSelectedVerses={setSelectedVerses}
        />
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={isUpdating || selectedVerses.length === 0}
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save updated verses"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type BibleContentProps = {
  selectedVerses: BibleVerse[];
  setSelectedVerses: Dispatch<SetStateAction<BibleVerse[]>>;
};

function BibleContent({
  selectedVerses,
  setSelectedVerses,
}: BibleContentProps) {
  const { chapters, book } = useBibleStudyContext();

  if (book == null) {
    return null;
  }

  return (
    <div className="max-h-[calc(100vh-20rem)] overflow-y-auto py-4">
      {chapters.map((chapter) => (
        <BibleChapter
          key={chapter.id}
          size="sm"
          book={book}
          chapter={chapter}
          isSelectTextEnabled={true}
          selectedVerses={selectedVerses}
          setSelectedVerses={setSelectedVerses}
        />
      ))}
    </div>
  );
}
