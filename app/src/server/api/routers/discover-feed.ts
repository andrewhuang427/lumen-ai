import { z } from "zod";
import { DiscoverFeedService } from "../../services/discover-feed-service";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

export const discoverFeedRouter = createTRPCRouter({
  getFeed: authenticatedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return DiscoverFeedService.getFeed(ctx, input);
    }),
  getPost: authenticatedProcedure.input(z.string()).query(({ ctx, input }) => {
    return DiscoverFeedService.getPost(ctx, input);
  }),
  likePost: authenticatedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return DiscoverFeedService.likePost(ctx, input);
    }),
});
