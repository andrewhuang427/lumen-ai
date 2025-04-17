import {
  type BibleStudyPost,
  BibleStudyPostStatus,
  FollowStatus,
  type User,
  type UserFollowRequest,
} from "@prisma/client";
import { z } from "zod";
import { type Context } from "../context";
import { type ModelType, TierConfig } from "../utils/model-config";
import { PermissionsService } from "./permissions-service";

async function getUser(context: Context, userId: string): Promise<User | null> {
  return await context.db.user.findUnique({
    where: {
      id: userId,
    },
  });
}

export type UserProfile = Pick<User, "id" | "name" | "username" | "avatar_url">;

async function getUserByUsername(
  context: Context,
  username: string,
): Promise<UserProfile | null> {
  return await context.db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      name: true,
      username: true,
      avatar_url: true,
    },
  });
}

async function getFollowStatus(
  context: Context,
  requesterUserId: string,
  userId: string,
): Promise<FollowStatus | null> {
  const followRequest = await context.db.userFollowRequest.findFirst({
    where: {
      from_user_id: requesterUserId,
      to_user_id: userId,
    },
  });

  if (followRequest == null) {
    return null;
  }

  return followRequest.status;
}

async function getUserFollowersCount(
  context: Context,
  userId: string,
): Promise<number> {
  return await context.db.userFollowRequest.count({
    where: {
      to_user_id: userId,
      status: FollowStatus.ACCEPTED,
    },
  });
}

async function getUserFollowers(
  context: Context,
  requesterUserId: string,
  userId: string,
): Promise<User[]> {
  await PermissionsService.validateUserIsFollowing(
    context,
    requesterUserId,
    userId,
  );
  const requests = await context.db.userFollowRequest.findMany({
    where: {
      to_user_id: userId,
      status: FollowStatus.ACCEPTED,
    },
    include: {
      from_user: true,
    },
  });
  return requests.map((request) => request.from_user);
}

async function getUserFollowingCount(
  context: Context,
  userId: string,
): Promise<number> {
  return await context.db.userFollowRequest.count({
    where: {
      from_user_id: userId,
      status: FollowStatus.ACCEPTED,
    },
  });
}

async function getUserFollowing(
  context: Context,
  requesterUserId: string,
  userId: string,
): Promise<User[]> {
  await PermissionsService.validateUserIsFollowing(
    context,
    requesterUserId,
    userId,
  );
  const requests = await context.db.userFollowRequest.findMany({
    where: {
      from_user_id: userId,
      status: FollowStatus.ACCEPTED,
    },
    include: {
      to_user: true,
    },
  });
  return requests.map((request) => request.to_user);
}

type UserSearchResult = Pick<User, "id" | "name" | "username" | "avatar_url">;

async function getUserSearchResults(
  context: Context,
  searchTerm: string,
): Promise<UserSearchResult[]> {
  return await context.db.user.findMany({
    where: {
      OR: [
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatar_url: true,
    },
    take: 10,
  });
}

async function getUserPublishedPosts(
  context: Context,
  requesterUserId: string,
  userId: string,
): Promise<BibleStudyPost[]> {
  await PermissionsService.validateUserIsFollowing(
    context,
    requesterUserId,
    userId,
  );
  return await context.db.bibleStudyPost.findMany({
    where: {
      user_id: userId,
      status: BibleStudyPostStatus.PUBLISHED,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export type AvailableModel = {
  type: ModelType;
  name: string;
  description: string;
};

async function getAvailableModels(
  context: Context,
): Promise<{ models: AvailableModel[]; defaultModel: AvailableModel }> {
  const tier = context.dbUser?.tier;
  if (!tier) {
    throw new Error("User not found");
  }
  const config = TierConfig[tier];
  return {
    models: config.models.map((model) => ({
      type: model.type,
      name: model.name,
      description: model.description,
    })),
    defaultModel: {
      type: config.defaultModel.type,
      name: config.defaultModel.name,
      description: config.defaultModel.description,
    },
  };
}

async function followUser(
  context: Context,
  requesterUserId: string,
  userId: string,
): Promise<UserFollowRequest> {
  if (requesterUserId === userId) {
    throw new Error("Cannot follow yourself");
  }

  const existingFollowRequest = await context.db.userFollowRequest.findFirst({
    where: {
      from_user_id: requesterUserId,
      to_user_id: userId,
    },
  });

  if (existingFollowRequest) {
    return existingFollowRequest;
  }

  return await context.db.userFollowRequest.create({
    data: {
      from_user_id: requesterUserId,
      to_user_id: userId,
      status: FollowStatus.PENDING,
    },
  });
}

async function unfollowUser(
  context: Context,
  requesterUserId: string,
  userId: string,
): Promise<UserFollowRequest> {
  if (requesterUserId === userId) {
    throw new Error("Cannot unfollow yourself");
  }

  const existingFollowRequest = await context.db.userFollowRequest.findFirst({
    where: {
      from_user_id: requesterUserId,
      to_user_id: userId,
    },
  });

  if (!existingFollowRequest) {
    throw new Error("Follow request not found");
  }

  return await context.db.userFollowRequest.delete({
    where: {
      id: existingFollowRequest.id,
    },
  });
}

export type FollowRequestWithUser = {
  id: string;
  status: FollowStatus;
  from_user: Pick<User, "id" | "name" | "username" | "avatar_url">;
};

async function getFollowRequests(
  context: Context,
  userId: string,
  status: FollowStatus,
): Promise<FollowRequestWithUser[]> {
  return await context.db.userFollowRequest.findMany({
    where: {
      to_user_id: userId,
      status,
    },
    select: {
      id: true,
      status: true,
      from_user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar_url: true,
        },
      },
    },
  });
}

export const followRequestActionSchema = z.enum(["accept", "reject"]);

async function updateFollowRequestStatus(
  context: Context,
  requestId: string,
  action: z.infer<typeof followRequestActionSchema>,
): Promise<UserFollowRequest> {
  return await context.db.userFollowRequest.update({
    where: { id: requestId },
    data: {
      status:
        action === "accept" ? FollowStatus.ACCEPTED : FollowStatus.REJECTED,
    },
  });
}

export const UserService = {
  getUser,
  getUserByUsername,
  getFollowStatus,
  getUserFollowersCount,
  getUserFollowers,
  getUserFollowingCount,
  getUserFollowing,
  getUserSearchResults,
  getUserPublishedPosts,
  getAvailableModels,
  followUser,
  unfollowUser,
  getFollowRequests,
  updateFollowRequestStatus,
};
