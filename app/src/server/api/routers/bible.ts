import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { BibleService, GetVersesSchema } from "../../services/bible-service";

export const bibleRouter = createTRPCRouter({
  getVersions: publicProcedure.query(({ ctx }) => {
    return BibleService.getVersions(ctx);
  }),
  getBooks: publicProcedure
    .input(z.object({ versionId: z.string() }))
    .query(({ ctx, input }) => {
      return BibleService.getBooks(ctx, input.versionId);
    }),
  getChapters: publicProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return BibleService.getChapters(ctx, input.bookId);
    }),
  getChapter: publicProcedure
    .input(z.object({ chapterId: z.string() }))
    .query(async ({ ctx, input }) => {
      return BibleService.getChapter(ctx, input.chapterId);
    }),
  getVerses: publicProcedure
    .input(GetVersesSchema)
    .query(async ({ ctx, input }) => {
      return BibleService.getVerses(ctx, input);
    }),
});
