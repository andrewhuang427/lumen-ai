import { type BibleStudySession, StudyActivityType } from "@prisma/client";
import { type JsonValue } from "@prisma/client/runtime/library";
import { differenceInCalendarDays, startOfDay } from "date-fns";
import { type Activity } from "react-activity-calendar";
import { type Context } from "../context";
import { type TypedBibleStudyNote } from "../utils/bible-note-utils";

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
  session: BibleStudySession,
): Promise<void> {
  await logActivity(
    context,
    userId,
    StudyActivityType.SESSION_CREATED,
    session.id,
    session.start_chapter_id,
  );
}

/**
 * Logs when a user creates a Bible study note
 */
async function logNoteCreated(
  context: Context,
  userId: string,
  note: TypedBibleStudyNote,
): Promise<void> {
  const metadata = { note: note.session_id };
  await logActivity(
    context,
    userId,
    StudyActivityType.NOTE_CREATED,
    note.id,
    undefined, // chapterId
    undefined, // timeSpent
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
  startDate?: Date,
  endDate?: Date,
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

  const totalTimeSpent = activities.reduce((total, activity) => {
    return total + (activity.time_spent ?? 0);
  }, 0);

  return {
    chaptersRead,
    sessionsCreated,
    notesCreated,
    totalTimeSpent,
    totalActivities: activities.length,
  };
}

async function getActivityCalendar(
  context: Context,
  userId: string,
  year: number,
): Promise<Activity[]> {
  const activities = await context.db.userStudyActivity.findMany({
    where: {
      user_id: userId,
      activity_date: {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31),
      },
    },
  });

  const dateCountMap: Record<string, number> = {};

  for (const activity of activities) {
    if (activity.activity_date) {
      const dateObj = new Date(activity.activity_date);
      const normalizedDate = startOfDay(dateObj);
      const dateStr = normalizedDate.toISOString().split("T")[0];
      if (dateStr === undefined) {
        continue;
      }
      if (dateCountMap[dateStr] === undefined) {
        dateCountMap[dateStr] = 0;
      } else {
        dateCountMap[dateStr] += 1;
      }
    }
  }

  const calendarData: Activity[] = Object.entries(dateCountMap).map(
    ([dateStr, count]) => {
      let level = 0;
      if (count >= 10) level = 4;
      else if (count >= 7) level = 3;
      else if (count >= 4) level = 2;
      else if (count >= 2) level = 1;
      return {
        date: dateStr,
        count,
        level,
      };
    },
  );

  const startDate = new Date(year, 0, 1);
  const startDateStr = startDate.toISOString().split("T")[0];
  if (
    startDateStr != null &&
    !calendarData.some((d) => d.date === startDateStr)
  ) {
    calendarData.push({
      date: startDateStr,
      count: 0,
      level: 0,
    });
  }

  const today = new Date();
  const endOfYear = new Date(year, 11, 31);
  const endDate = endOfYear > today ? today : endOfYear;
  const endDateStr = endDate.toISOString().split("T")[0];
  if (endDateStr != null && !calendarData.some((d) => d.date === endDateStr)) {
    calendarData.push({
      date: endDateStr,
      count: 0,
      level: 0,
    });
  }

  return calendarData.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

export const UserActivityService = {
  logChapterRead,
  logSessionCreated,
  logNoteCreated,
  getUserStreakInfo,
  getRecentActivities,
  getActivityStats,
  getActivityCalendar,
};
