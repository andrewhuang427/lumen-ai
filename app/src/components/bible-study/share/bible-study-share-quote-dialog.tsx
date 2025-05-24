"use client";

import {
  type BibleBook,
  type BibleChapter,
  type BibleVerse,
} from "@prisma/client";
import { Share } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import BibleStudyShareQuoteDialogSelectFont from "./bible-study-share-quote-dialog-select-font";
import BibleStudyShareQuoteDialogSelectFontSize from "./bible-study-share-quote-dialog-select-font-size";
import BibleStudyShareQuoteDialogSelectImage from "./bible-study-share-quote-dialog-select-image";
import BibleStudyShareQuoteDialogSelectOpacity from "./bible-study-share-quote-dialog-select-opacity";
import useBibleStudyShareQuoteCanvas from "./use-bible-study-share-quote-canvas";

export const DEFAULT_OVERLAY_OPACITY = 0.5;

type Props = {
  book: BibleBook;
  quote: string;
  mergedVerses: BibleVerse[][];
  chapters: BibleChapter[];
};

export default function BibleStudyShareQuoteDialog({
  book,
  quote,
  mergedVerses,
  chapters,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    canvasRef,
    selectedFont,
    fontSize,
    opacity,
    size,
    handleSetImage,
    setSelectedFont,
    setFontSize,
    setOpacity,
  } = useBibleStudyShareQuoteCanvas(
    dialogOpen,
    book,
    quote,
    mergedVerses,
    chapters,
  );

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" onClick={() => {}}>
          <Share size={16} className="text-blue-500" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Share Quote</DialogTitle>
          <DialogDescription>
            Share the following quote from scripture
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <BibleStudyShareQuoteDialogSelectImage onSelect={handleSetImage} />
          <Separator orientation="vertical" />
          <BibleStudyShareQuoteDialogSelectFont
            font={selectedFont}
            onSelect={setSelectedFont}
          />
          <BibleStudyShareQuoteDialogSelectFontSize
            fontSize={fontSize}
            onSelect={setFontSize}
          />
        </div>
        <BibleStudyShareQuoteDialogSelectOpacity
          opacity={opacity}
          onSelect={setOpacity}
        />
        <canvas
          ref={canvasRef}
          className="block h-auto w-full rounded-lg border"
          width={size?.width ?? 0}
          height={size?.height ?? 0}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
