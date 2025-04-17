"use client";

import { type BibleStudyNoteType } from "@prisma/client";
import { Loader2, Merge, Split } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Progress } from "../ui/progress";
import { mergeVerses } from "./bible-study-utils";
import useBibleStudyContext from "./context/use-bible-study-context";
import { useBibleStudyVerseNotes } from "./hooks/use-bible-study-verse-notes";

type BibleStudySplitVersesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteType: BibleStudyNoteType | null;
  onComplete: () => void;
};

export default function BibleStudySplitVersesDialog({
  open,
  onOpenChange,
  noteType,
  onComplete,
}: BibleStudySplitVersesDialogProps) {
  const [action, setAction] = useState<"split" | "merge" | null>(null);
  const [splitProgress, setSplitProgress] = useState(0);
  const { selectedVerses, chapters } = useBibleStudyContext();
  const { createNoteFromVerses, isLoading } = useBibleStudyVerseNotes();

  const mergedVerses = useMemo(
    () => mergeVerses(selectedVerses, chapters),
    [selectedVerses, chapters],
  );

  function updateProgress(current: number, total: number) {
    setSplitProgress((current / total) * 100);
  }

  async function handleSplitVerses() {
    if (noteType == null) {
      return;
    }

    try {
      setAction("split");
      setSplitProgress(0);
      for (let i = 0; i < selectedVerses.length; i++) {
        const verse = selectedVerses[i];
        if (verse != null) {
          await createNoteFromVerses(noteType, [[verse]]);
          updateProgress(i + 1, selectedVerses.length);
        }
      }
      onComplete();
    } finally {
      resetState();
    }
  }

  async function handleMergeVerses() {
    if (noteType == null) {
      return;
    }
    try {
      setAction("merge");
      await createNoteFromVerses(noteType, mergedVerses);
      onComplete();
    } finally {
      resetState();
    }
  }

  function resetState() {
    setAction(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Multiple verses selected
          </DialogTitle>
          <DialogDescription className="text-center">
            We&apos;ve noticed you&apos;ve selected multiple verses. Would you
            like to split them into separate notes or combine them into one?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-6">
          {action === "split" && <Progress value={splitProgress} />}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              disabled={isLoading}
              onClick={handleSplitVerses}
            >
              {isLoading && action === "split" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Split size={16} />
              )}
              Split verses
            </Button>
            <Button disabled={isLoading} onClick={handleMergeVerses}>
              {isLoading && action === "merge" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Merge size={16} />
              )}
              Combine verses
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
