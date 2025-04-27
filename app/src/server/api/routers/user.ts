import { FollowStatus } from "@prisma/client";
import { z } from "zod";
import { UserPreferencesService } from "../../services/user-preferences-service";
import {
  followRequestActionSchema,
  UserService,
} from "../../services/user-service";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc";

export const userRouter = createTRPCRouter({
  getAuthenticatedUser: publicProcedure.query(({ ctx }) => {
    return UserService.getAuthenticatedUser(ctx);
  }),
  getOrCreateAuthenticatedUser: publicProcedure.mutation(({ ctx }) => {
    return UserService.getOrCreateAuthenticatedUser(ctx);
  }),
  getUserByUsername: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return UserService.getUserByUsername(ctx, input);
    }),
  getFollowStatus: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return UserService.getFollowStatus(ctx, ctx.user.id, input);
    }),
  getUserFollowersCount: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return UserService.getUserFollowersCount(ctx, input);
    }),
  getUserFollowers: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return UserService.getUserFollowers(ctx, ctx.user.id, input);
    }),
  getUserFollowingCount: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return UserService.getUserFollowingCount(ctx, input);
    }),
  getUserFollowing: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return UserService.getUserFollowing(ctx, ctx.user.id, input);
    }),
  getUserSearchResults: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return UserService.getUserSearchResults(ctx, input);
    }),
  getUserPublishedPosts: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return UserService.getUserPublishedPosts(ctx, ctx.user.id, input);
    }),
  getAvailableModels: authenticatedProcedure.query(({ ctx }) => {
    return UserService.getAvailableModels(ctx);
  }),
  followUser: authenticatedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return UserService.followUser(ctx, ctx.user.id, input);
    }),
  unfollowUser: authenticatedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return UserService.unfollowUser(ctx, ctx.user.id, input);
    }),
  getPendingFollowRequests: authenticatedProcedure.query(({ ctx }) => {
    return UserService.getFollowRequests(
      ctx,
      ctx.user.id,
      FollowStatus.PENDING,
    );
  }),
  updateFollowRequestStatus: authenticatedProcedure
    .input(
      z.object({
        requestId: z.string(),
        action: followRequestActionSchema,
      }),
    )
    .mutation(({ ctx, input }) => {
      return UserService.updateFollowRequestStatus(
        ctx,
        input.requestId,
        input.action,
      );
    }),
  getReadingLocation: publicProcedure.query(({ ctx }) => {
    return UserPreferencesService.getReadingLocation(ctx, ctx.user?.id);
  }),
  updateReadingLocation: authenticatedProcedure
    .input(
      z.object({
        versionId: z.string().uuid({ message: "Invalid version ID format" }),
        bookId: z.string().uuid({ message: "Invalid book ID format" }),
        chapterId: z.string().uuid({ message: "Invalid chapter ID format" }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return UserPreferencesService.updateReadingLocation(
        ctx,
        ctx.user.id,
        input,
      );
    }),
  clearReadingLocation: authenticatedProcedure.mutation(({ ctx }) => {
    return UserPreferencesService.clearReadingLocation(ctx, ctx.user.id);
  }),
  updatePreferredBibleVersion: authenticatedProcedure
    .input(
      z.object({
        versionId: z.string().uuid({ message: "Invalid version ID format" }),
      }),
    )
    .mutation(({ ctx, input }) => {
      return UserPreferencesService.updatePreferredBibleVersion(
        ctx,
        ctx.user.id,
        input.versionId,
      );
    }),
});
