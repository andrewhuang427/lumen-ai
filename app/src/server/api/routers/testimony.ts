import { z } from "zod";
import {
  TestimonyService,
  UpdateTestimonyInputSchema,
} from "../../services/testimony-service";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

const createTestimonyInput = z.object({
  title: z.string(),
});

export const testimonyRouter = createTRPCRouter({
  createTestimony: authenticatedProcedure
    .input(createTestimonyInput)
    .mutation(({ ctx, input }) => {
      return TestimonyService.createTestimony(ctx, {
        ...input,
        userId: ctx.user.id,
      });
    }),
  updateTestimony: authenticatedProcedure
    .input(UpdateTestimonyInputSchema)
    .mutation(({ ctx, input }) => {
      return TestimonyService.updateTestimony(ctx, input);
    }),
  deleteTestimony: authenticatedProcedure
    .input(z.object({ testimonyId: z.string() }))
    .mutation(({ ctx, input }) => {
      return TestimonyService.deleteTestimony(ctx, input.testimonyId);
    }),
  getTestimony: authenticatedProcedure
    .input(z.object({ testimonyId: z.string() }))
    .query(({ ctx, input }) => {
      return TestimonyService.getTestimony(ctx, input.testimonyId);
    }),
  getUserTestimonies: authenticatedProcedure.query(({ ctx }) => {
      return TestimonyService.getUserTestimonies(ctx, ctx.user.id);
    }),
});