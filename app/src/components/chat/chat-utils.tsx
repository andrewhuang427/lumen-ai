import { type ChatThread } from "@prisma/client";
import { BOOKS } from "../../server/utils/bible-utils";

const bookNames = BOOKS.map((b) => b.name);

// Create a regex pattern from the book names, escaping special characters
const booksPattern = bookNames
  .map((book) => book.replace(/([.*+?^${}()|[\]\\])/g, "\\$1"))
  .join("|");

export const bibleReferenceRegex = new RegExp(
  `((?:${booksPattern})\\s+\\d+(?:(?::\\d+)?(?:-\\d+(?::\\d+)?)?)?)`,
  "g",
);

export function parseBibleReferenceDetails(reference: string): {
  bookName: string;
  startChapter: number;
  startVerse?: number;
  endVerse?: number;
} | null {
  // Remove extra whitespace and split into parts
  const cleanRef = reference.trim().replace(/\s+/g, " ");

  // Match the book name (including potential number prefix)
  const bookMatch = /^([1-3]?\s*[A-Za-z]+)/.exec(cleanRef);
  if (!bookMatch) {
    return null;
  }
  const bookName = bookMatch[0].trim();

  // Extract numbers portion after book name
  const numbersText = cleanRef.slice(bookName.length).trim();
  if (!numbersText) {
    return null;
  }

  // Check if this is a chapter range (no colon) or a verse reference
  const isVerseReference = numbersText.includes(":");

  if (isVerseReference) {
    // Handle verse references (e.g., "John 3:16" or "John 3:16-18")
    const parts = numbersText.split("-");
    const startParts = parts?.[0]?.split(":");
    const startChapter = parseInt(startParts?.[0] ?? "0");
    const startVerse = parseInt(startParts?.[1] ?? "0");

    if (!startChapter || !startVerse) return null;

    // If there's a range
    if (parts[1]) {
      // Just end verse in same chapter (e.g., "18")
      const endVerse = parseInt(parts[1]);
      return endVerse
        ? {
            bookName,
            startChapter,
            startVerse,
            endVerse,
          }
        : null;
    }

    return { bookName, startChapter, startVerse };
  } else {
    // For single chapter references (e.g., "John 3")
    const chapter = parseInt(numbersText.trim());

    if (chapter == null || isNaN(chapter)) {
      return null;
    }

    return {
      bookName,
      startChapter: chapter,
    };
  }
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

export function groupThreadsByDate(threads: ChatThread[]): {
  today: ChatThread[];
  yesterday: ChatThread[];
  older: ChatThread[];
} {
  if (!threads) return { today: [], yesterday: [], older: [] };

  return threads.reduce(
    (acc, thread) => {
      const threadDate = new Date(thread.created_at);

      if (isToday(threadDate)) {
        acc.today.push(thread);
      } else if (isYesterday(threadDate)) {
        acc.yesterday.push(thread);
      } else {
        acc.older.push(thread);
      }

      return acc;
    },
    {
      today: [] as ChatThread[],
      yesterday: [] as ChatThread[],
      older: [] as ChatThread[],
    },
  );
}
