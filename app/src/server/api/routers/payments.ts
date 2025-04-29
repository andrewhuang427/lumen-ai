import { PaymentsService } from "../../services/payments-service";
import { authenticatedProcedure, createTRPCRouter } from "../trpc";

export const paymentsRouter = createTRPCRouter({
  createPaymentIntent: authenticatedProcedure.mutation(async ({ ctx }) => {
    return PaymentsService.createPaymentIntent(ctx);
  }),
});
