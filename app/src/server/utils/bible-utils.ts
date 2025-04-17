import {
  type BibleBook,
  type BibleChapter,
  type BibleHeading,
  type BibleStudySession,
  type BibleVerse,
  type BibleVersion,
} from "@prisma/client";

// ================ Types ================

export type Section = {
  heading?: string;
  verses: BibleVerse[];
};

export type BibleVersionWithCount = BibleVersion & {
  _count: {
    books: number;
  };
};

export type BibleChapterWithSections = BibleChapter & {
  sections: Section[];
};

export type EnrichedBibleStudySession = BibleStudySession & {
  book: BibleBook;
  chapters: BibleChapterWithSections[];
};

// ================ Util Functions ================

export function convertChapterToChapterWithSections(
  chapter: BibleChapter & { verses: BibleVerse[]; headings: BibleHeading[] },
): BibleChapterWithSections {
  return {
    ...chapter,
    sections: getChapterSections(chapter),
  };
}

export function getChapterSections(
  chapter: BibleChapter & { verses: BibleVerse[]; headings: BibleHeading[] },
): Section[] {
  const { verses, headings } = chapter;

  // Sort verses and headings by their respective numbers
  verses.sort((a, b) => a.verse_number - b.verse_number);
  headings.sort((a, b) => a.start_verse_number - b.start_verse_number);

  const sections: Section[] = [];
  let currentSection: Section = { verses: [] };
  let headingIndex = 0;

  for (const verse of chapter.verses) {
    // Check if the current verse starts a new section by matching a heading

    while (
      headingIndex < headings.length &&
      (headings[headingIndex]?.start_verse_number ?? Number.MAX_VALUE) <=
        verse.verse_number
    ) {
      // If the current section already has content, finalize it
      if (currentSection.verses.length > 0 || currentSection.heading) {
        sections.push(currentSection);
        currentSection = { verses: [] };
      }

      // Start a new section with the current heading
      currentSection.heading = headings[headingIndex]?.text;
      headingIndex++;
    }

    // Add the current verse to the section
    currentSection.verses.push(verse);
  }

  // Append the last section if it contains any content
  if (currentSection.verses.length > 0 || currentSection.heading) {
    sections.push(currentSection);
  }

  return sections;
}

// ================ Constants ================

type Book = {
  name: string;
  abbreviation: string;
  chapters: number;
};

export const BOOKS: Book[] = [
  { name: "Genesis", abbreviation: "GEN", chapters: 50 },
  { name: "Exodus", abbreviation: "EXO", chapters: 40 },
  { name: "Leviticus", abbreviation: "LEV", chapters: 27 },
  { name: "Numbers", abbreviation: "NUM", chapters: 36 },
  { name: "Deuteronomy", abbreviation: "DEU", chapters: 34 },
  { name: "Joshua", abbreviation: "JOS", chapters: 24 },
  { name: "Judges", abbreviation: "JDG", chapters: 21 },
  { name: "Ruth", abbreviation: "RUT", chapters: 4 },
  { name: "1 Samuel", abbreviation: "1SA", chapters: 31 },
  { name: "2 Samuel", abbreviation: "2SA", chapters: 24 },
  { name: "1 Kings", abbreviation: "1KI", chapters: 22 },
  { name: "2 Kings", abbreviation: "2KI", chapters: 25 },
  { name: "1 Chronicles", abbreviation: "1CH", chapters: 29 },
  { name: "2 Chronicles", abbreviation: "2CH", chapters: 36 },
  { name: "Ezra", abbreviation: "EZR", chapters: 10 },
  { name: "Nehemiah", abbreviation: "NEH", chapters: 13 },
  { name: "Esther", abbreviation: "EST", chapters: 10 },
  { name: "Job", abbreviation: "JOB", chapters: 42 },
  { name: "Psalms", abbreviation: "PSA", chapters: 150 },
  { name: "Proverbs", abbreviation: "PRO", chapters: 31 },
  { name: "Ecclesiastes", abbreviation: "ECC", chapters: 12 },
  { name: "Song of Solomon", abbreviation: "SNG", chapters: 8 },
  { name: "Isaiah", abbreviation: "ISA", chapters: 66 },
  { name: "Jeremiah", abbreviation: "JER", chapters: 52 },
  { name: "Lamentations", abbreviation: "LAM", chapters: 5 },
  { name: "Ezekiel", abbreviation: "EZK", chapters: 48 },
  { name: "Daniel", abbreviation: "DAN", chapters: 12 },
  { name: "Hosea", abbreviation: "HOS", chapters: 14 },
  { name: "Joel", abbreviation: "JOE", chapters: 3 },
  { name: "Amos", abbreviation: "AMO", chapters: 9 },
  { name: "Obadiah", abbreviation: "OBA", chapters: 1 },
  { name: "Jonah", abbreviation: "JON", chapters: 4 },
  { name: "Micah", abbreviation: "MIC", chapters: 7 },
  { name: "Nahum", abbreviation: "NAH", chapters: 3 },
  { name: "Habakkuk", abbreviation: "HAB", chapters: 3 },
  { name: "Zephaniah", abbreviation: "ZEP", chapters: 3 },
  { name: "Haggai", abbreviation: "HAG", chapters: 2 },
  { name: "Zechariah", abbreviation: "ZEC", chapters: 14 },
  { name: "Malachi", abbreviation: "MAL", chapters: 4 },
  { name: "Matthew", abbreviation: "MAT", chapters: 28 },
  { name: "Mark", abbreviation: "MAR", chapters: 16 },
  { name: "Luke", abbreviation: "LUK", chapters: 24 },
  { name: "John", abbreviation: "JHN", chapters: 21 },
  { name: "Acts", abbreviation: "ACT", chapters: 28 },
  { name: "Romans", abbreviation: "ROM", chapters: 16 },
  { name: "1 Corinthians", abbreviation: "1CO", chapters: 16 },
  { name: "2 Corinthians", abbreviation: "2CO", chapters: 13 },
  { name: "Galatians", abbreviation: "GAL", chapters: 6 },
  { name: "Ephesians", abbreviation: "EPH", chapters: 6 },
  { name: "Philippians", abbreviation: "PHP", chapters: 4 },
  { name: "Colossians", abbreviation: "COL", chapters: 4 },
  { name: "1 Thessalonians", abbreviation: "1TH", chapters: 5 },
  { name: "2 Thessalonians", abbreviation: "2TH", chapters: 3 },
  { name: "1 Timothy", abbreviation: "1TI", chapters: 6 },
  { name: "2 Timothy", abbreviation: "2TI", chapters: 4 },
  { name: "Titus", abbreviation: "TIT", chapters: 3 },
  { name: "Philemon", abbreviation: "PHM", chapters: 1 },
  { name: "Hebrews", abbreviation: "HEB", chapters: 13 },
  { name: "James", abbreviation: "JAS", chapters: 5 },
  { name: "1 Peter", abbreviation: "1PE", chapters: 5 },
  { name: "2 Peter", abbreviation: "2PE", chapters: 3 },
  { name: "1 John", abbreviation: "1JO", chapters: 5 },
  { name: "2 John", abbreviation: "2JO", chapters: 1 },
  { name: "3 John", abbreviation: "3JO", chapters: 1 },
  { name: "Jude", abbreviation: "JUD", chapters: 1 },
  { name: "Revelation", abbreviation: "REV", chapters: 22 },
];
