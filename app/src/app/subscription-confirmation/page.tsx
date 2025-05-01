import ConfirmationPage from "../../components/subscription/confirmation/confirmation-page";
import { api } from "../../trpc/server";

type Props = {
  searchParams: Promise<{
    payment_intent: string;
  }>;
};

export default async function SubscriptionConfirmationPage({
  searchParams,
}: Props) {
  const response = await searchParams;
  const paymentIntentId = response.payment_intent;
  const status = await api.payments.getPaymentIntentStatus({
    paymentIntentId,
  });

  return <ConfirmationPage paymentIntentStatus={status} />;
}
