import ConfirmationPage from "../../components/subscription/confirmation/confirmation-page";

type Props = {
  searchParams: Promise<{
    payment_intent: string;
    payment_intent_client_secret: string;
    redirect_status: string;
  }>;
};

export default async function SubscriptionConfirmationPage({
  searchParams,
}: Props) {
  const response = await searchParams;
  const paymentIntent = response.payment_intent;
  const paymentIntentClientSecret = response.payment_intent_client_secret;
  const redirectStatus = response.redirect_status;

  return (
    <ConfirmationPage
      paymentIntent={paymentIntent}
      paymentIntentClientSecret={paymentIntentClientSecret}
      redirectStatus={redirectStatus}
    />
  );
}
