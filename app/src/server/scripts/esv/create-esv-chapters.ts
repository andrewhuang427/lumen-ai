import { type BibleChapter } from "@prisma/client";
import { db } from "../../db";
import { BOOKS } from "../../utils/bible-utils";
import { getPassageText } from "./esv-bible-utils";

const books = [
  // "Genesis",
  // "Exodus",
  // "Leviticus",
  // "Numbers",
  // "Deuteronomy",
  // "Joshua",
  // "Judges",
  // "Ruth",
  // "1 Samuel",
  // "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  // "Lamentations",
  // "Ezekiel",
  // "Daniel",
  // "Hosea",
  // "Joel",
  // "Amos",
  // "Obadiah",
  // "Jonah",
  // "Micah",
  // "Nahum",
  // "Habakkuk",
  // "Zephaniah",
  // "Haggai",
  // "Zechariah",
  // "Malachi",
  // "Matthew",
  // "Mark",
  // "Luke",
  // "John",
  // "Acts",
  // "Romans",
  // "1 Corinthians",
  // "2 Corinthians",
  // "Galatians",
  // "Ephesians",
  // "Philippians",
  // "Colossians",
  // "1 Thessalonians",
  // "2 Thessalonians",
  // "1 Timothy",
  // "2 Timothy",
  // "Titus",
  // "Philemon",
  // "Hebrews",
  // "James",
  // "1 Peter",
  // "2 Peter",
  // "1 John",
  // "2 John",
  // "3 John",
  // "Jude",
  // "Revelation",
];

async function createEsvChapters(bookName: string) {
  const book = await db.bibleBook.findFirst({
    where: { name: bookName },
  });
  if (book == null) {
    throw new Error("Book not found");
  }
  const numChapters = BOOKS.find((book) => book.name === bookName)?.chapters;
  if (numChapters == null) {
    throw new Error("Num chapters not found");
  }
  for (let chapterNum = 1; chapterNum <= numChapters; chapterNum++) {
    let newChapter: BibleChapter | null = null;
    try {
      newChapter = await db.bibleChapter.create({
        data: {
          number: chapterNum,
          book_id: book.id,
        },
      });
    } catch (error) {
      try {
        console.log(error);
        newChapter = await db.bibleChapter.findFirstOrThrow({
          where: {
            book_id: book.id,
            number: chapterNum,
          },
        });
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    const parsedName = book.name.split(" ").join("+");
    const chapterText = await getPassageText(
      `${parsedName}${numChapters === 1 ? "" : `+chapter${chapterNum}`}`,
    );
    const passage = chapterText.passages[0];
    const headingAndVerses = getHeadingAndVerses(passage);
    for (const { heading, verses } of headingAndVerses) {
      const firstVerse = verses[0];
      if (firstVerse == null) {
        continue;
      } else {
        if (heading != null) {
          try {
            await db.bibleHeading.create({
              data: {
                text: heading,
                chapter_id: newChapter.id,
                start_verse_number: firstVerse.verseNumber,
              },
            });
          } catch (error) {
            console.error(error);
          }
        }
        for (const verse of verses) {
          try {
            await db.bibleVerse.create({
              data: {
                chapter_id: newChapter.id,
                text: verse.verseText,
                verse_number: verse.verseNumber,
              },
            });
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }
}

async function main() {
  for (const bookName of books) {
    await createEsvChapters(bookName);
  }
}

void main();

// Parsing utils
function getHeadingAndVerses(passage: string) {
  const sections = splitByUnderscoreChains(passage);

  const response = [];

  for (const section of sections) {
    const { heading: sectionHeading, verses: versesText } =
      splitSectionIntoHeadingAndVerses(section);

    const verses = splitVerses(versesText);

    if (verses.length > 0) {
      response.push({
        heading: sectionHeading,
        verses,
      });
    }
  }

  return response;
}

function splitByUnderscoreChains(input: string): string[] {
  // This regex looks for a newline, followed by 4 or more underscores, and then another newline.
  const delimiterRegex = /_{4,}/g;

  // Split the input string by the underscore-delimiter lines.
  const sections = input.split(delimiterRegex);

  return sections;
}

function splitSectionIntoHeadingAndVerses(text: string): {
  heading?: string;
  verses: string;
} {
  const verseRegex = /\[\d+\]/; // Matches `[19]`, `[20]`, `[1]`, etc.
  const match = verseRegex.exec(text);

  let heading: string | undefined = undefined;
  let verses = "";

  if (match) {
    const firstVerseIndex = text.indexOf(match[0]);
    heading = text.slice(0, firstVerseIndex);
    verses = text.slice(firstVerseIndex);
  } else {
    // If no verse pattern is found, treat the entire text as heading.
    heading = text;
  }

  const invalidHeadingRegex = /^=+\n.+/;
  if (heading != null && invalidHeadingRegex.test(heading)) {
    heading = undefined;
  }

  return { heading: heading != null ? heading.trim() : undefined, verses };
}

function splitVerses(
  text: string,
): { verseNumber: number; verseText: string }[] {
  // This regex does the following:
  // - `\[(\d+)\]` captures the verse number inside square brackets.
  // - `(.*?)` (with the `s` flag) matches any characters (including newlines) non-greedily.
  // - `(?=\[\d+\]|$)` ensures we look ahead to the next verse marker or the end of the string, without consuming it.
  const regex = /\[(\d+)\](.*?)(?=\[\d+\]|$)/gs;

  const results: { verseNumber: number; verseText: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const verseNumber = parseInt(match?.[1] ?? "", 10);
    // Directly use match[2] without trimming to preserve all whitespace
    const verseText = match?.[2] ?? "";
    results.push({ verseNumber, verseText });
  }

  return results;
}
