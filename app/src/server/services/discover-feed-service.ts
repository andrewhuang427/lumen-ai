import {
  type BibleBook,
  type BibleChapter,
  type BibleStudyPost,
  type BibleStudyPostImage,
  type BibleStudyPostLike,
  BibleStudyPostStatus,
  FollowStatus,
} from "@prisma/client";
import { type Context } from "../context";
import { PermissionsService } from "./permissions-service";

export type EnrichedBibleStudyPost = BibleStudyPost & {
  user: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
  session: {
    book: BibleBook;
    start_chapter: BibleChapter;
    end_chapter: BibleChapter | null;
  };
  images: BibleStudyPostImage[];
  likes: BibleStudyPostLike[];
};

async function getFeed(
  ctx: Context,
  options: {
    limit?: number;
    cursor?: string;
  },
): Promise<{
  posts: EnrichedBibleStudyPost[];
  nextCursor: string | undefined;
}> {
  if (!ctx.user) {
    throw new Error("User not authenticated");
  }

  const { limit = 5, cursor } = options;

  const posts = await ctx.db.bibleStudyPost.findMany({
    where: {
      status: BibleStudyPostStatus.PUBLISHED,
      OR: [
        {
          user: {
            receivedFollowRequests: {
              some: {
                from_user_id: ctx.user.id,
                status: FollowStatus.ACCEPTED,
              },
            },
          },
        },
        {
          user_id: ctx.user.id,
        },
      ],
    },
    include: {
      user: true,
      likes: true,
      images: true,
      session: {
        select: {
          book: true,
          start_chapter: true,
          end_chapter: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    take: limit + 1, // get an extra post to check if there is a next page
    cursor: cursor ? { id: cursor } : undefined,
  });

  // derive next cursor
  let nextCursor: string | undefined = undefined;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem!.id;
  }

  return {
    posts,
    nextCursor,
  };
}

async function getPost(
  ctx: Context,
  postId: string,
): Promise<EnrichedBibleStudyPost> {
  if (!ctx.user) {
    throw new Error("User not authenticated");
  }

  const post = await ctx.db.bibleStudyPost.findUniqueOrThrow({
    where: { id: postId },
    include: {
      user: true,
      images: true,
      likes: true,
      session: {
        include: {
          book: true,
          start_chapter: true,
          end_chapter: true,
        },
      },
    },
  });

  await PermissionsService.validateUserIsFollowing(
    ctx,
    ctx.user.id,
    post.user.id,
  );

  return post;
}

async function likePost(
  ctx: Context,
  postId: string,
): Promise<BibleStudyPostLike | null> {
  if (!ctx.user) {
    throw new Error("User not authenticated");
  }

  const existingLike = await ctx.db.bibleStudyPostLike.findFirst({
    where: {
      post_id: postId,
      user_id: ctx.user.id,
    },
  });

  if (existingLike) {
    await ctx.db.bibleStudyPostLike.delete({
      where: { id: existingLike.id },
    });
    return null;
  }

  return await ctx.db.bibleStudyPostLike.create({
    data: {
      post_id: postId,
      user_id: ctx.user.id,
    },
  });
}

export const DiscoverFeedService = {
  getFeed,
  getPost,
  likePost,
};
