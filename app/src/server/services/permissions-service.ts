import {
  type BibleStudyNote,
  type BibleStudyPost,
  type BibleStudySession,
  type ChatThread,
  FollowStatus,
  type UserDailyPrayer,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type Context } from "../context";

async function validateBibleStudySessionBelongsToUser(
  ctx: Context,
  sessionId: string,
): Promise<BibleStudySession> {
  if (ctx.user == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const session = await ctx.db.bibleStudySession.findUnique({
    where: { id: sessionId },
  });
  if (session == null || session.user_id !== ctx.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Session does not belong to user",
    });
  }

  return session;
}

async function validatePostBelongsToUser(
  ctx: Context,
  postId: string,
): Promise<BibleStudyPost> {
  if (ctx.user == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const post = await ctx.db.bibleStudyPost.findUnique({
    where: { id: postId },
  });
  if (post == null || post.user_id !== ctx.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Post does not belong to user",
    });
  }

  return post;
}

async function validateNoteBelongsToUser(
  ctx: Context,
  noteId: string,
): Promise<BibleStudyNote> {
  if (ctx.user == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const note = await ctx.db.bibleStudyNote.findUnique({
    where: { id: noteId },
    include: { session: true },
  });
  if (note == null || note.session.user_id !== ctx.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Note does not belong to user",
    });
  }

  return note;
}

async function validateChatThreadBelongsToUser(
  ctx: Context,
  threadId: string,
): Promise<ChatThread> {
  if (ctx.user == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const thread = await ctx.db.chatThread.findUnique({
    where: { id: threadId },
  });
  if (thread == null || thread.user_id !== ctx.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Thread does not belong to user",
    });
  }

  return thread;
}

async function validateUserIsFollowing(
  ctx: Context,
  fromUserId: string,
  toUserId: string,
): Promise<void> {
  if (fromUserId === toUserId) {
    // User is requesting their own profile
    return;
  }

  const userFollowRequest = await ctx.db.userFollowRequest.findFirst({
    where: {
      from_user_id: fromUserId,
      to_user_id: toUserId,
    },
  });
  if (
    userFollowRequest == null ||
    userFollowRequest.status !== FollowStatus.ACCEPTED
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not following this user",
    });
  }
}

async function validateDailyPrayerBelongsToUser(
  ctx: Context,
  prayerId: string,
): Promise<UserDailyPrayer> {
  if (ctx.user == null) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const prayer = await ctx.db.userDailyPrayer.findUnique({
    where: { id: prayerId },
  });
  if (prayer == null || prayer.user_id !== ctx.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Daily prayer does not belong to user",
    });
  }

  return prayer;
}

export const PermissionsService = {
  validateBibleStudySessionBelongsToUser,
  validatePostBelongsToUser,
  validateNoteBelongsToUser,
  validateChatThreadBelongsToUser,
  validateUserIsFollowing,
  validateDailyPrayerBelongsToUser,
};
