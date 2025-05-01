import { z } from "zod";
import { PaymentsService } from "../../services/payments-service";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

export const paymentsRouter = createTRPCRouter({
  getProducts: authenticatedProcedure.query(async ({ ctx }) => {
    return PaymentsService.getProducts(ctx);
  }),
  createPaymentIntent: authenticatedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return PaymentsService.createPaymentIntent(ctx, input.priceId);
    }),
  getPaymentIntentStatus: authenticatedProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return PaymentsService.getPaymentIntentStatus(ctx, input.paymentIntentId);
    }),
  getActiveSubscription: authenticatedProcedure.query(async ({ ctx }) => {
    return PaymentsService.getActiveSubscription(ctx);
  }),
  cancelSubscription: authenticatedProcedure.mutation(async ({ ctx }) => {
    return PaymentsService.cancelSubscription(ctx);
  }),
});
