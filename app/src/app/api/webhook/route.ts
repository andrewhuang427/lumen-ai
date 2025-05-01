import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PaymentsService } from "../../../server/services/payments-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    if (!signature || !webhookSecret) {
      return new Response("Webhook secret not found.", { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (error) {
    let errorMessage = "Unknown error while constructing stripe event";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(`❌ Error message: ${errorMessage}`);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        await PaymentsService.updateSubscription(subscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    let errorMessage = "Unknown error while processing webhook";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`Error processing webhook: ${errorMessage}`);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
