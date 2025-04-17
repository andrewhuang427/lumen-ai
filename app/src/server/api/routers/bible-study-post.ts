import { BibleStudyPostStatus, BibleStudyPostType } from "@prisma/client";
import { z } from "zod";
import {
  BibleStudyPostService,
  UpdatePostInputSchema,
} from "../../services/bible-study-post-service";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

const createPostInput = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.nativeEnum(BibleStudyPostType),
  status: z.nativeEnum(BibleStudyPostStatus),
  contentJson: z.object({}).passthrough(),
  contentText: z.string(),
  sessionId: z.string(),
});

export type CreatePostInput = z.infer<typeof createPostInput>;

export const bibleStudyPostRouter = createTRPCRouter({
  createPost: authenticatedProcedure
    .input(createPostInput)
    .mutation(({ ctx, input }) => {
      return BibleStudyPostService.createPost(ctx, {
        ...input,
        userId: ctx.user.id,
      });
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
