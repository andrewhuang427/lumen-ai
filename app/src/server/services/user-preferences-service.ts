import {
  type BibleBook,
  type BibleChapter,
  type BibleVersion,
  type UserDailyPrayer,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { z } from "zod";
import { type Context } from "../context";
import {
  validateBibleVersion,
  validateReadingLocation,
} from "../utils/bible-validation-utils";
import { PermissionsService } from "./permissions-service";

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

async function getDailyPrayers(context: Context): Promise<UserDailyPrayer[]> {
  const userId = context.user?.id;
  if (userId == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const user = await context.db.user.findUnique({
    where: { id: userId },
    include: { daily_prayers: true },
  });

  return user?.daily_prayers ?? [];
}

async function getTodaysDailyPrayer(
  context: Context,
): Promise<UserDailyPrayer | null> {
  const userId = context.user?.id;
  if (userId == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const user = await context.db.user.findUnique({
    where: { id: userId },
    include: { daily_prayers: true },
  });

  const dailyPrayers = user?.daily_prayers ?? [];

  const dailyPrayer =
    dailyPrayers.find((p) => {
      const now = new Date();
      const prayerDate = new Date(p.created_at);
      return isWithinInterval(prayerDate, {
        start: startOfDay(now),
        end: endOfDay(now),
      });
    }) ?? null;

  return dailyPrayer;
}

export const CreateDailyPrayerInputSchema = z.object({
  prayerText: z.string(),
  prayerJson: z.object({}).passthrough().optional(),
});

export type CreateDailyPrayerInput = z.infer<
  typeof CreateDailyPrayerInputSchema
>;

async function createDailyPrayer(
  context: Context,
  input: CreateDailyPrayerInput,
): Promise<UserDailyPrayer> {
  const userId = context.user?.id;
  if (userId == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return await context.db.userDailyPrayer.create({
    data: {
      user_id: userId,
      prayer_text: input.prayerText,
      prayer_json: input.prayerJson,
    },
  });
}

export const UpdateDailyPrayerInputSchema = z.object({
  prayerId: z.string(),
  prayerText: z.string(),
  prayerJson: z.object({}).passthrough().optional(),
});

export type UpdateDailyPrayerInput = z.infer<
  typeof UpdateDailyPrayerInputSchema
>;

async function updateDailyPrayer(
  context: Context,
  input: UpdateDailyPrayerInput,
): Promise<UserDailyPrayer> {
  await PermissionsService.validateDailyPrayerBelongsToUser(
    context,
    input.prayerId,
  );

  return await context.db.userDailyPrayer.update({
    where: { id: input.prayerId },
    data: { prayer_text: input.prayerText, prayer_json: input.prayerJson },
  });
}

export const UserPreferencesService = {
  getReadingLocation,
  updateReadingLocation,
  clearReadingLocation,
  updatePreferredBibleVersion,
  getDailyPrayers,
  getTodaysDailyPrayer,
  createDailyPrayer,
  updateDailyPrayer,
};
