import Stripe from "stripe";
import { env } from "../env";

const createStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);

const globalForStripe = globalThis as unknown as {
  stripe: ReturnType<typeof createStripe> | undefined;
};

export const stripe = globalForStripe.stripe ?? createStripe();

if (env.NODE_ENV !== "production") globalForStripe.stripe = stripe;
