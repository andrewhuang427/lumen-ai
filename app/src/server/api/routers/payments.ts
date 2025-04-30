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
  getPaymentIntent: authenticatedProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return PaymentsService.getPaymentIntent(ctx, input.paymentIntentId);
    }),
});
