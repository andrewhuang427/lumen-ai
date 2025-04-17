import { TRPCError } from "@trpc/server";
import type { Context } from "../context";

/**
 * Validates that a Bible version exists
 *
 * @param context The request context with database access
 * @param versionId The ID of the Bible version to validate
 * @throws TRPCError if validation fails
 */
export async function validateBibleVersion(
  context: Context,
  versionId: string,
): Promise<void> {
  const version = await context.db.bibleVersion.findUnique({
    where: { id: versionId },
  });

  if (!version) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Bible version with ID ${versionId} not found`,
    });
  }
}

/**
 * Validates that a Bible book exists and belongs to the specified version
 *
 * @param context The request context with database access
 * @param bookId The ID of the Bible book to validate
 * @param versionId The ID of the Bible version the book should belong to
 * @throws TRPCError if validation fails
 */
export async function validateBibleBook(
  context: Context,
  bookId: string,
  versionId: string,
): Promise<void> {
  const book = await context.db.bibleBook.findUnique({
    where: { id: bookId },
    include: { version: true },
  });

  if (!book) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Bible book with ID ${bookId} not found`,
    });
  }

  if (book.version_id !== versionId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Bible book with ID ${bookId} does not belong to version ${versionId}`,
    });
  }
}

/**
 * Validates that a Bible chapter exists and belongs to the specified book
 *
 * @param context The request context with database access
 * @param chapterId The ID of the Bible chapter to validate
 * @param bookId The ID of the Bible book the chapter should belong to
 * @throws TRPCError if validation fails
 */
export async function validateBibleChapter(
  context: Context,
  chapterId: string,
  bookId: string,
): Promise<void> {
  const chapter = await context.db.bibleChapter.findUnique({
    where: { id: chapterId },
  });

  if (!chapter) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Bible chapter with ID ${chapterId} not found`,
    });
  }

  if (chapter.book_id !== bookId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Bible chapter with ID ${chapterId} does not belong to book ${bookId}`,
    });
  }
}

/**
 * Validates a complete Bible reading location (version, book, and chapter)
 * Ensures that the version, book, and chapter exist and have the correct relationships
 *
 * @param context The request context with database access
 * @param location The reading location to validate
 * @throws TRPCError if validation fails
 */
export async function validateReadingLocation(
  context: Context,
  location: {
    versionId: string;
    bookId: string;
    chapterId: string;
  },
): Promise<void> {
  await Promise.all([
    validateBibleVersion(context, location.versionId),
    validateBibleBook(context, location.bookId, location.versionId),
    validateBibleChapter(context, location.chapterId, location.bookId),
  ]);
}
