import { z } from "zod";
import { UserActivityService } from "../../services/user-activity-service";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

export const userActivityRouter = createTRPCRouter({
  getUserStreakInfo: authenticatedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return UserActivityService.getUserStreakInfo(ctx, input.userId);
    }),
  getRecentActivities: authenticatedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return UserActivityService.getRecentActivities(ctx, input.userId);
    }),
  getActivityStats: authenticatedProcedure
    .input(
      z.object({
        userId: z.string(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return UserActivityService.getActivityStats(
        ctx,
        input.userId,
        input.startDate,
        input.endDate,
      );
    }),
});
