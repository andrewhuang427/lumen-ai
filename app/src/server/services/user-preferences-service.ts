import {
  type BibleBook,
  type BibleChapter,
  type BibleVersion,
} from "@prisma/client";
import { type Context } from "../context";
import {
  validateBibleVersion,
  validateReadingLocation,
} from "../utils/bible-validation-utils";

export type ReadingLocation = {
  version: BibleVersion | null;
  book: BibleBook | null;
  chapter: BibleChapter | null;
};

/**
 * Get the user's current reading location and preferences
 */
async function getReadingLocation(
  context: Context,
  userId?: string,
): Promise<ReadingLocation> {
  if (userId == null) {
    return getFirstGenesisChapter(context);
  }

  const user = await context.db.user.findUnique({
    where: { id: userId },
    include: {
      preferred_bible_version: true,
      last_visited_book: true,
      last_visited_chapter: true,
    },
  });

  if (!user) {
    return getFirstGenesisChapter(context);
  }

  return {
    version: user.preferred_bible_version,
    book: user.last_visited_book,
    chapter: user.last_visited_chapter,
  };
}

/**
 * Update the user's complete reading location (version, book, and chapter)
 * This ensures all location components stay in sync
 * Validates that the version, book, and chapter exist and have the correct relationships
 */
async function updateReadingLocation(
  context: Context,
  userId: string,
  location: {
    versionId: string;
    bookId: string;
    chapterId: string;
  },
): Promise<ReadingLocation> {
  await validateReadingLocation(context, location);
  const user = await context.db.user.update({
    where: { id: userId },
    data: {
      preferred_bible_version_id: location.versionId,
      last_visited_book_id: location.bookId,
      last_visited_chapter_id: location.chapterId,
    },
    include: {
      preferred_bible_version: true,
      last_visited_book: true,
      last_visited_chapter: true,
    },
  });
  return {
    version: user.preferred_bible_version,
    book: user.last_visited_book,
    chapter: user.last_visited_chapter,
  };
}

/**
 * Clear all of the user's reading location data
 */
async function clearReadingLocation(
  context: Context,
  userId: string,
): Promise<ReadingLocation> {
  const user = await context.db.user.update({
    where: { id: userId },
    data: {
      preferred_bible_version_id: null,
      last_visited_book_id: null,
      last_visited_chapter_id: null,
    },
    include: {
      preferred_bible_version: true,
      last_visited_book: true,
      last_visited_chapter: true,
    },
  });

  return {
    version: user.preferred_bible_version,
    book: user.last_visited_book,
    chapter: user.last_visited_chapter,
  };
}

/**
 * Update just the user's preferred Bible version while maintaining their current location
 * Validates that the version exists
 */
async function updatePreferredBibleVersion(
  context: Context,
  userId: string,
  versionId: string,
): Promise<ReadingLocation> {
  await validateBibleVersion(context, versionId);
  const user = await context.db.user.update({
    where: { id: userId },
    data: {
      preferred_bible_version_id: versionId,
    },
    include: {
      preferred_bible_version: true,
      last_visited_book: true,
      last_visited_chapter: true,
    },
  });

  return {
    version: user.preferred_bible_version,
    book: user.last_visited_book,
    chapter: user.last_visited_chapter,
  };
}

async function getFirstGenesisChapter(
  context: Context,
): Promise<ReadingLocation> {
  const firstVersion = await context.db.bibleVersion.findFirst({
    orderBy: {
      name: "asc",
    },
  });

  const genesis = await context.db.bibleBook.findFirst({
    where: {
      name: "Genesis",
      version_id: firstVersion?.id,
    },
  });

  const genesisChapter1 = await context.db.bibleChapter.findFirst({
    where: {
      number: 1,
      book_id: genesis?.id,
    },
  });

  return {
    version: firstVersion,
    book: genesis,
    chapter: genesisChapter1,
  };
}

export const UserPreferencesService = {
  getReadingLocation,
  updateReadingLocation,
  clearReadingLocation,
  updatePreferredBibleVersion,
};
