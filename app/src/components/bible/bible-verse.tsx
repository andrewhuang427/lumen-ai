import { type BibleVerse as BibleVerseType } from "@prisma/client";
import { Fragment } from "react";
import { cn } from "../../lib/utils";
import { getVerseId } from "../utils/bible-utils";

type Props = {
  verse: BibleVerseType;
  isSelectTextEnabled: boolean;
  isSelected?: boolean;
  size?: "sm" | "md";
  onSelect?: (verse: BibleVerseType) => void;
};

export default function BibleVerse({
  verse,
  isSelectTextEnabled,
  isSelected = false,
  size = "md",
  onSelect,
}: Props) {
  function handleClick(event: React.MouseEvent<HTMLSpanElement>) {
    event.stopPropagation();
    onSelect?.(verse);
  }

  return (
    <Fragment>
      <span
        className={cn(
          "align-top text-xs text-blue-500",
          isSelectTextEnabled ? "cursor-pointer" : "",
        )}
      >
        {verse.verse_number}
      </span>
      <span
        id={getVerseId(verse.id)}
        className={cn(
          "select-none whitespace-pre-wrap transition-colors duration-500",
          size === "sm" ? "text-sm" : "text-base",
          isSelected === true
            ? "cursor-pointer text-yellow-500"
            : isSelectTextEnabled
              ? `cursor-pointer hover:bg-muted`
              : "",
        )}
        onClick={handleClick}
      >
        {verse.text}
      </span>
    </Fragment>
  );
}
