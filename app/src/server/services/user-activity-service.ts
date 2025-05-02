import { StudyActivityType } from "@prisma/client";
import { type JsonValue } from "@prisma/client/runtime/library";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import { type Context } from "../context";

/**
 * Updates a user's study streak based on their latest activity
 */
async function updateUserStreak(
  context: Context,
  userId: string,
  activityDate: Date = new Date(),
): Promise<void> {
  const today = startOfDay(activityDate);

  const streak = await context.db.userStudyStreak.findUnique({
    where: { user_id: userId },
  });

  if (!streak) {
    await context.db.userStudyStreak.create({
      data: {
        user_id: userId,
        current_streak_days: 1,
        longest_streak_days: 1,
        last_study_date: today,
        total_study_days: 1,
        total_chapters_studied: 0,
        streak_start_date: today,
      },
    });
    return;
  }

  const lastStudyDate = startOfDay(streak.last_study_date);
  const dayDifference = differenceInCalendarDays(today, lastStudyDate);

  if (dayDifference === 0) {
    return;
  }

  if (dayDifference === 1) {
    const newStreakDays = streak.current_streak_days + 1;
    const newLongestStreak = Math.max(
      newStreakDays,
      streak.longest_streak_days,
    );

    await context.db.userStudyStreak.update({
      where: { id: streak.id },
      data: {
        current_streak_days: newStreakDays,
        longest_streak_days: newLongestStreak,
        last_study_date: today,
        total_study_days: streak.total_study_days + 1,
      },
    });
    return;
  }

  await context.db.userStudyStreak.update({
    where: { id: streak.id },
    data: {
      current_streak_days: 1,
      last_study_date: today,
      total_study_days: streak.total_study_days + 1,
      streak_start_date: today,
    },
  });
}

/**
 * Increments the number of chapters studied in a user's streak
 */
async function incrementChaptersStudied(
  context: Context,
  userId: string,
): Promise<void> {
  await context.db.userStudyStreak.upsert({
    where: { user_id: userId },
    update: {
      total_chapters_studied: { increment: 1 },
    },
    create: {
      user_id: userId,
      current_streak_days: 1,
      longest_streak_days: 1,
      last_study_date: new Date(),
      total_study_days: 1,
      total_chapters_studied: 1,
      streak_start_date: new Date(),
    },
  });
}

/**
 * Logs any Bible study activity and updates streak
 */
async function logActivity(
  context: Context,
  userId: string,
  activityType: StudyActivityType,
  referenceId?: string,
  chapterId?: string,
  timeSpent?: number,
  metadata?: JsonValue,
): Promise<void> {
  const activityDate = new Date();

  await context.db.userStudyActivity.create({
    data: {
      user_id: userId,
      activity_type: activityType,
      activity_date: activityDate,
      reference_id: referenceId,
      chapter_id: chapterId,
      time_spent: timeSpent,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    },
  });

  await updateUserStreak(context, userId, activityDate);

  if (activityType === StudyActivityType.CHAPTER_READ && chapterId) {
    await incrementChaptersStudied(context, userId);
  }
}

/**
 * Logs when a user reads a Bible chapter
 */
async function logChapterRead(
  context: Context,
  userId: string,
  chapterId: string,
  timeSpent?: number,
  verseRange?: { startVerse: number; endVerse: number },
): Promise<void> {
  const metadata = verseRange ? { verseRange } : undefined;
  await logActivity(
    context,
    userId,
    StudyActivityType.CHAPTER_READ,
    chapterId,
    chapterId,
    timeSpent,
    metadata,
  );
}

/**
 * Logs when a user creates a Bible study session
 */
async function logSessionCreated(
  context: Context,
  userId: string,
  sessionId: string,
  chapterId?: string,
): Promise<void> {
  await logActivity(
    context,
    userId,
    StudyActivityType.SESSION_CREATED,
    sessionId,
    chapterId,
  );
}

/**
 * Logs when a user creates a Bible study note
 */
async function logNoteCreated(
  context: Context,
  userId: string,
  noteId: string,
  sessionId: string,
  chapterId?: string,
): Promise<void> {
  const metadata = { sessionId };
  await logActivity(
    context,
    userId,
    StudyActivityType.NOTE_CREATED,
    noteId,
    chapterId,
    undefined,
    metadata,
  );
}

/**
 * Logs when a user creates a Bible study post
 */
async function logPostCreated(
  context: Context,
  userId: string,
  postId: string,
  sessionId: string,
  chapterId?: string,
): Promise<void> {
  const metadata = { sessionId };
  await logActivity(
    context,
    userId,
    StudyActivityType.POST_CREATED,
    postId,
    chapterId,
    undefined,
    metadata,
  );
}

/**
 * Gets current streak information for a user
 */
async function getUserStreakInfo(context: Context, userId: string) {
  const streak = await context.db.userStudyStreak.findUnique({
    where: { user_id: userId },
  });

  if (!streak) {
    return {
      current_streak_days: 0,
      longest_streak_days: 0,
      total_study_days: 0,
      total_chapters_studied: 0,
      has_studied_today: false,
    };
  }

  const today = startOfDay(new Date());
  const lastStudyDate = startOfDay(streak.last_study_date);
  const hasStudiedToday = differenceInCalendarDays(today, lastStudyDate) === 0;

  return {
    ...streak,
    has_studied_today: hasStudiedToday,
  };
}

/**
 * Gets recent study activities for a user
 */
async function getRecentActivities(
  context: Context,
  userId: string,
  limit = 10,
) {
  return context.db.userStudyActivity.findMany({
    where: { user_id: userId },
    orderBy: { activity_date: "desc" },
    take: limit,
    include: {
      chapter: {
        include: {
          book: true,
        },
      },
    },
  });
}

/**
 * Gets activity statistics for a date range
 */
async function getActivityStats(
  context: Context,
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const activities = await context.db.userStudyActivity.findMany({
    where: {
      user_id: userId,
      activity_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { activity_date: "asc" },
  });

  const chaptersRead = activities.filter(
    (a) => a.activity_type === StudyActivityType.CHAPTER_READ,
  ).length;
  const sessionsCreated = activities.filter(
    (a) => a.activity_type === StudyActivityType.SESSION_CREATED,
  ).length;
  const notesCreated = activities.filter(
    (a) => a.activity_type === StudyActivityType.NOTE_CREATED,
  ).length;
  const postsCreated = activities.filter(
    (a) => a.activity_type === StudyActivityType.POST_CREATED,
  ).length;

  const totalTimeSpent = activities.reduce((total, activity) => {
    return total + (activity.time_spent ?? 0);
  }, 0);

  return {
    chaptersRead,
    sessionsCreated,
    notesCreated,
    postsCreated,
    totalTimeSpent,
    totalActivities: activities.length,
  };
}

export const UserActivityService = {
  logChapterRead,
  logSessionCreated,
  logNoteCreated,
  logPostCreated,
  getUserStreakInfo,
  getRecentActivities,
  getActivityStats,
};
