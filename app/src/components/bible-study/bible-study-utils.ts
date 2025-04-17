import {
  type BibleBook,
  type BibleChapter,
  type BibleVerse,
} from "@prisma/client";
import {
  type BibleStudyNoteVerseGroupType,
  type BibleStudyNoteVerseType,
} from "../../server/utils/bible-note-utils";
import { type BibleChapterWithSections } from "../../server/utils/bible-utils";

/**
 * Merges verses into chunks of consecutive verses.
 *
 * @param verses - The verses to merge.
 * @param chapters - The chapters to use for sorting.
 * @returns The merged verses.
 */
export function mergeVerses(
  verses: BibleVerse[],
  chapters: BibleChapter[],
): BibleVerse[][] {
  if (verses.length === 0) return [];

  // Sort verses by chapter and verse number
  const sortedVerses = verses.sort((a, b) => {
    if (a.chapter_id === b.chapter_id) {
      return a.verse_number - b.verse_number;
    }

    const aChapter = chapters.find((chapter) => chapter.id === a.chapter_id);
    const bChapter = chapters.find((chapter) => chapter.id === b.chapter_id);

    if (aChapter == null || bChapter == null) {
      return 0;
    }

    return aChapter.number - bChapter.number;
  });

  const mergedVerses: BibleVerse[][] = [];
  let currentChapterId = sortedVerses[0]?.chapter_id;
  let currentGroup: BibleVerse[] = [];

  for (const verse of sortedVerses) {
    const currentGroupLastVerseNumber =
      currentGroup[currentGroup.length - 1]?.verse_number;

    // verse's chapter is different from the current chapter
    if (verse.chapter_id !== currentChapterId) {
      mergedVerses.push(currentGroup);
      currentGroup = [];
      currentGroup.push(verse);
      currentChapterId = verse.chapter_id;
    } else if (
      currentGroup.length > 0 &&
      currentGroupLastVerseNumber != null &&
      verse.verse_number !== currentGroupLastVerseNumber + 1
    ) {
      mergedVerses.push(currentGroup);
      currentGroup = [];
      currentGroup.push(verse);
    } else {
      currentGroup.push(verse);
    }
  }

  if (currentGroup.length > 0) {
    mergedVerses.push(currentGroup);
  }

  return mergedVerses;
}

export function toSelectedVerses(
  groupedVerses: BibleStudyNoteVerseType[][],
  chapters: BibleChapterWithSections[],
): BibleVerse[] {
  // 1. get all verses from chapters
  const allVerses = chapters
    .map((c) => c.sections.map((section) => section.verses).flat())
    .flat();

  return groupedVerses
    .map((group) =>
      group
        .map((verse) => {
          const v = allVerses.find((v) => v.id === verse.id);
          return v ?? null;
        })
        .filter((verse) => verse != null),
    )
    .flat()
    .filter((verse) => verse != null);
}

export function toNoteVerses(
  mergedVerses: BibleVerse[][],
  chapters: BibleChapter[],
  book: BibleBook,
): BibleStudyNoteVerseGroupType[] {
  return mergedVerses.map((section) => {
    const first = section[0];
    if (first == null) {
      return [];
    }

    const chapter = chapters.find((c) => c.id === first.chapter_id);
    if (chapter == null) {
      return [];
    }

    return section.map((v) => ({
      id: v.id,
      book: book.name,
      chapter: chapter.number,
      verse: v.verse_number,
      text: v.text,
    }));
  });
}

export function getNoteId(noteId: string) {
  return `note_${noteId}`;
}

export function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}
