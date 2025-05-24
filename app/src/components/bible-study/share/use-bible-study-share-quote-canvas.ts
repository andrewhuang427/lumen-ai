import {
  type BibleBook,
  type BibleChapter,
  type BibleVerse,
} from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_OVERLAY_OPACITY } from "./bible-study-share-quote-dialog";
import { DEFAULT_IMAGE_OPTIONS } from "./bible-study-share-quote-dialog-select-image";

export type ImageSize = {
  width: number;
  height: number;
};

const DEFAULT_FONT = "Georgia";
const DEFAULT_FONT_SIZE_PERCENT = 0.05;
const DEFAULT_IMAGE_SIZE: ImageSize = { width: 0, height: 0 };

export default function useBibleStudyShareQuoteCanvas(
  dialogOpen: boolean,
  book: BibleBook,
  quote: string,
  mergedVerses: BibleVerse[][],
  chapters: BibleChapter[],
) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [selectedFont, setSelectedFont] = useState<string>(DEFAULT_FONT);
  const [size, setSize] = useState<ImageSize>(DEFAULT_IMAGE_SIZE);
  const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE_PERCENT);
  const [opacity, setOpacity] = useState<number>(DEFAULT_OVERLAY_OPACITY);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCanvas = useCallback(
    (
      bg: HTMLImageElement | null,
      font: string,
      sizePercent: number,
      opacity: number,
      size: ImageSize,
    ) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !bg || !size) {
        return;
      }
      const imageWidth = size.width;
      const imageHeight = size.height;
      canvas.width = imageWidth;
      canvas.height = imageHeight;

      // 1. Draw the image
      ctx.drawImage(bg, 0, 0, imageWidth, imageHeight);

      // 2. Draw the overlay
      ctx.fillStyle = `rgba(0,0,0,${opacity})`;
      ctx.fillRect(0, 0, imageWidth, imageHeight);

      // 3. Draw the text
      const text = quote;
      const fontSize = Math.round(imageHeight * sizePercent);
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.textAlign = "center";
      const maxWidth = imageWidth * 0.8;
      const lineHeight = fontSize * 1.4;
      const lines = wrapText(ctx, text, maxWidth);
      const totalHeight = lines.length * lineHeight;
      const x = imageWidth / 2;
      let y = imageHeight / 2 - totalHeight / 2 + lineHeight / 2;
      for (const line of lines) {
        ctx.fillText(line.trim(), x, y);
        y += lineHeight;
      }

      // 4. Draw verse references below the quote
      const referenceFontSize = Math.round(fontSize * 0.8);
      ctx.font = `${referenceFontSize}px ${font}`;
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.textAlign = "center";
      const referenceLineHeight = referenceFontSize * 1.3;
      const references = getVerseReference(book, chapters, mergedVerses);
      const referenceText = references.join("  •  ");
      ctx.fillText(referenceText, x, y + referenceLineHeight);
    },
    [quote, book, chapters, mergedVerses],
  );

  const handleSetImage = useCallback((src: string) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImage(img);

      // Scale lower resolution images to 1000px to render higher quality text
      const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
      const scale = minDimension > 1000 ? 1 : minDimension > 800 ? 2 : 4;
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;
      setSize({ width: scaledWidth, height: scaledHeight });
    };
  }, []);

  useEffect(() => {
    if (image) {
      drawCanvas(image, selectedFont, fontSize, opacity, size);
    }
  }, [image, selectedFont, fontSize, opacity, size, drawCanvas]);

  useEffect(() => {
    const firstImage = DEFAULT_IMAGE_OPTIONS[0];
    if (dialogOpen && firstImage) {
      handleSetImage(firstImage.path.src);
    }
  }, [dialogOpen, handleSetImage]);

  return {
    canvasRef,
    selectedFont,
    fontSize,
    opacity,
    size,
    handleSetImage,
    setSelectedFont,
    setFontSize,
    setOpacity,
  };
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let tempLine = "";
  const words = text.split(" ");
  for (let n = 0; n < words.length; n++) {
    const testLine = tempLine + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(tempLine);
      tempLine = words[n] + " ";
    } else {
      tempLine = testLine;
    }
  }
  lines.push(tempLine);
  return lines;
}

function getVerseReference(
  book: BibleBook,
  chapters: BibleChapter[],
  mergedVerses: BibleVerse[][],
): string[] {
  return mergedVerses
    .map((v) => {
      const first = v[0];
      const last = v[v.length - 1];
      if (first == null || last == null) {
        return null;
      }
      const chapter = chapters.find((c) => c.id === first.chapter_id);
      if (chapter == null) {
        return null;
      }
      return `${book.name} ${chapter.number}:${first.verse_number}${first.verse_number === last.verse_number ? "" : `-${last.verse_number}`}`;
    })
    .filter((r) => r != null);
}
