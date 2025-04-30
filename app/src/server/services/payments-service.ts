import { UserTier, type User, type UserStripeCustomer } from "@prisma/client";
import Stripe from "stripe";
import { type Context } from "../context";
import { db } from "../db";

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

async function getProducts(context: Context): Promise<
  {
    product: Stripe.Product;
    price: Stripe.Price;
  }[]
> {
  const stripe = context.stripe;
  const stripeProducts = await stripe.products.list({
    active: true,
  });

  const enrichedProducts = await Promise.all(
    await stripeProducts.data.map(async (product) => {
      const pricesList = await stripe.prices.list({ product: product.id });
      const firstPrice = pricesList.data.find(
        (price) => price.recurring?.interval === "month",
      );
      if (firstPrice == null) {
        return null;
      }
      return { product, price: firstPrice };
    }),
  );

  return enrichedProducts.filter((product) => product != null);
}

async function createPaymentIntent(context: Context, priceId: string) {
  if (context.user == null) {
    throw new Error("User not found");
  }

  const stripe = context.stripe;

  const userStripeCustomer = await getOrCreateStripeCustomer(
    context,
    context.user,
  );

  const subscription = await stripe.subscriptions.create({
    customer: userStripeCustomer.stripeCustomerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.confirmation_secret"],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const clientSecretString = invoice.confirmation_secret?.client_secret ?? "";

  return {
    subscriptionId: subscription.id,
    clientSecret: clientSecretString,
  };
}

async function getPaymentIntent(
  context: Context,
  paymentIntentId: string,
): Promise<Stripe.PaymentIntent> {
  const user = context.user;
  const stripe = context.stripe;

  if (user == null) {
    throw new Error("User not found");
  }

  const userStripeCustomer = await context.db.userStripeCustomer.findUnique({
    where: { userId: user.id },
  });
  if (userStripeCustomer == null) {
    throw new Error("Stripe customer not found");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["customer"],
  });

  const customer = paymentIntent.customer as Stripe.Customer;
  if (customer.id !== userStripeCustomer.stripeCustomerId) {
    throw new Error("Stripe customer not found");
  }

  return paymentIntent;
}

async function updateSubscription(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const stripeUser = await db.userStripeCustomer.findUnique({
    where: { stripeCustomerId: customerId },
    include: { user: true },
  });

  if (stripeUser == null) {
    throw new Error("User not found");
  }

  const user = stripeUser.user;
  const status = subscription.status;

  if (status === "active") {
    await db.user.update({
      where: { id: user.id },
      data: { tier: UserTier.PREMIUM },
    });
  }

  if (status === "incomplete_expired") {
    await db.user.update({
      where: { id: user.id },
      data: { tier: UserTier.FREE },
    });
  }

  if (status === "incomplete") {
    await db.user.update({
      where: { id: user.id },
      data: { tier: UserTier.FREE },
    });
  }
}
export const PaymentsService = {
  getOrCreateStripeCustomer,
  getProducts,
  createPaymentIntent,
  getPaymentIntent,
  updateSubscription,
};
