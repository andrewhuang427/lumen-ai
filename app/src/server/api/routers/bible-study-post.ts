import { z } from "zod";
import {
  BibleStudyPostService,
  CreatePostImageInputSchema,
  CreatePostInputSchema,
  UpdatePostInputSchema,
} from "../../services/bible-study-post-service";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

export const bibleStudyPostRouter = createTRPCRouter({
  createPost: authenticatedProcedure
    .input(CreatePostInputSchema)
    .mutation(({ ctx, input }) => {
      return BibleStudyPostService.createPost(ctx, input);
    }),
  createPostImage: authenticatedProcedure
    .input(CreatePostImageInputSchema)
    .mutation(({ ctx, input }) => {
      return BibleStudyPostService.createPostImage(ctx, input);
    }),
  summarizeSession: authenticatedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(({ ctx, input }) => {
      return BibleStudyPostService.summarizeSession(ctx, input.sessionId);
    }),
  updatePost: authenticatedProcedure
    .input(UpdatePostInputSchema)
    .mutation(({ ctx, input }) => {
      return BibleStudyPostService.updatePost(ctx, input);
    }),
  deletePost: authenticatedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(({ ctx, input }) => {
      return BibleStudyPostService.deletePost(ctx, input.postId);
    }),
  getPost: authenticatedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(({ ctx, input }) => {
      return BibleStudyPostService.getPost(ctx, input.sessionId);
    }),
  getUserPosts: authenticatedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return BibleStudyPostService.getUserPosts(ctx, input.userId);
    }),
});
