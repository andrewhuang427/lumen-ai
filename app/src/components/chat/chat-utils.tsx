import * as React from "react";
import { ChatThreadAssistantMessageReferenceLink } from "./thread/messages/chat-thread-assistant-message-reference-link";
import { BOOKS } from "../../server/utils/bible-utils";

export function parseBibleReferences(text: string) {
  const bookNames = BOOKS.map((b) => b.name);

  // Create a regex pattern from the book names, escaping special characters
  const booksPattern = bookNames
    .map((book) => book.replace(/([.*+?^${}()|[\]\\])/g, "\\$1"))
    .join("|");

  const bibleRefPattern = new RegExp(
    `((?:${booksPattern})\\s+\\d+(?:(?::\\d+)?(?:-\\d+(?::\\d+)?)?)?)`,
    "g",
  );
  const parts = text.split(bibleRefPattern);

  return parts.map((part, i) => {
    // Skip processing if part is not a string
    if (typeof part !== "string") return part;

    const needsLeadingSpace = i > 0 && !parts[i - 1]?.match(/\s$/);

    if (part.match(bibleRefPattern)) {
      return (
        <React.Fragment key={i}>
          {needsLeadingSpace && " "}
          <ChatThreadAssistantMessageReferenceLink reference={part.trim()} />
        </React.Fragment>
      );
    }
    return part;
  });
}

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
