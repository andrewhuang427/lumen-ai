import { UserTier, type User, type UserStripeCustomer } from "@prisma/client";
import { type Stripe } from "stripe";
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

type Product = {
  name: string;
  description: string;
  price: Stripe.Price;
};

async function getProducts(context: Context): Promise<Product[]> {
  const stripe = context.stripe;
  const stripeProducts = await stripe.products.list({
    active: true,
  });

  const enrichedProducts = await Promise.all(
    stripeProducts.data.map(async (product) => {
      const pricesList = await stripe.prices.list({ product: product.id });
      const firstPrice = pricesList.data.find(
        (price) => price.recurring?.interval === "month",
      );
      if (firstPrice == null) {
        return null;
      }
      return {
        name: product.name,
        description: product.description ?? "",
        price: firstPrice,
      };
    }),
  );

  return enrichedProducts.filter((product) => product != null);
}

async function createPaymentIntent(
  context: Context,
  priceId: string,
): Promise<{ subscriptionId: string; clientSecret: string }> {
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

async function getPaymentIntentStatus(
  context: Context,
  paymentIntentId: string,
): Promise<Stripe.PaymentIntent.Status> {
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

  return paymentIntent.status;
}

async function updateSubscription(
  subscription: Stripe.Subscription,
): Promise<User | null> {
  const customerId = subscription.customer as string;
  const stripeUser = await db.userStripeCustomer.findUnique({
    where: { stripeCustomerId: customerId },
    include: { user: true },
  });

  console.log("subscription", subscription);
  console.log("stripeUser", stripeUser);

  if (stripeUser == null) {
    throw new Error("User not found");
  }

  const user = stripeUser.user;
  const status = subscription.status;

  console.log("status", status);

  try {
    if (status === "active" || status === "trialing") {
      return await db.user.update({
        where: { id: user.id },
        data: { tier: UserTier.PREMIUM },
      });
    }

    if (
      status === "canceled" ||
      status === "incomplete_expired" ||
      status === "incomplete" ||
      status === "past_due" ||
      status === "unpaid" ||
      status === "paused"
    ) {
      return await db.user.update({
        where: { id: user.id },
        data: { tier: UserTier.FREE },
      });
    }

    return null;
  } catch {
    return null;
  }
}

async function getActiveSubscription(
  context: Context,
): Promise<Stripe.Subscription | null> {
  if (context.user == null) {
    throw new Error("User not found");
  }

  const userStripeCustomer = await getOrCreateStripeCustomer(
    context,
    context.user,
  );

  const stripe = context.stripe;
  const subscriptions = await stripe.subscriptions.list({
    customer: userStripeCustomer.stripeCustomerId,
  });

  const activeSubscription = subscriptions.data.find(
    (subscription) => subscription.status === "active",
  );

  return activeSubscription ?? null;
}

async function cancelSubscription(context: Context): Promise<boolean> {
  if (context.user == null) {
    throw new Error("User not found");
  }

  const activeSubscription = await getActiveSubscription(context);
  if (activeSubscription == null) {
    throw new Error("No active subscription");
  }

  const stripe = context.stripe;
  await stripe.subscriptions.cancel(activeSubscription.id);
  return true;
}

export const PaymentsService = {
  getOrCreateStripeCustomer,
  getProducts,
  createPaymentIntent,
  getPaymentIntentStatus,
  updateSubscription,
  getActiveSubscription,
  cancelSubscription,
};
