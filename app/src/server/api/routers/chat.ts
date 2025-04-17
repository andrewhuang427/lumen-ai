import { z } from "zod";
import { authenticatedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { ChatService } from "~/server/services/chat-service";
import { ModelSchema } from "../../utils/model-config";

export const chatRouter = createTRPCRouter({
  createThread: authenticatedProcedure
    .input(
      z.object({
        initialMessage: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ChatService.createThread(ctx, input.initialMessage);
    }),
  sendMessage: authenticatedProcedure
    .input(
      z.object({
        threadId: z.string(),
        message: z.string().optional(),
        model: ModelSchema.optional(),
        isWebSearchEnabled: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      if (input.isWebSearchEnabled) {
        return ChatService.sendMessageWithWebSearch(
          ctx,
          input.threadId,
          input.message,
        );
      }
      return ChatService.sendMessage(ctx, input.threadId, input.message, {
        model: input.model,
      });
    }),
  getThread: authenticatedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ChatService.getThread(ctx, input);
    }),
  getThreads: authenticatedProcedure.query(({ ctx }) => {
    return ChatService.getUserThreads(ctx, ctx.user.id);
  }),
});
