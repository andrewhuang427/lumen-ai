import { type User, type UserStripeCustomer } from "@prisma/client";
import { type Context } from "../context";

async function getOrCreateStripeCustomer(
  context: Context,
  user: User,
): Promise<UserStripeCustomer> {
  const existingStripeCustomer = await context.db.userStripeCustomer.findUnique(
    { where: { userId: user.id } },
  );

  if (existingStripeCustomer != null) {
    return existingStripeCustomer;
  }

  const stripe = context.stripe;
  const stripeCustomer = await stripe.customers.create({
    name: user.name,
    email: user.email,
  });

  const userStripeCustomer = await context.db.userStripeCustomer.create({
    data: {
      userId: user.id,
      stripeCustomerId: stripeCustomer.id,
    },
  });

  return userStripeCustomer;
}

function createPaymentIntent(_context: Context) {}

export const PaymentsService = {
  getOrCreateStripeCustomer,
  createPaymentIntent,
};
