import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import ElementsProvider from "./elements-provider";

type Props = {
  clientSecret: string;
};

export default function PaymentForm({ clientSecret }: Props) {
  return (
    <ElementsProvider clientSecret={clientSecret}>
      <PaymentFormImpl />
    </ElementsProvider>
  );
}

function PaymentFormImpl() {
  const [isPending, setIsPending] = useState(false);

  const elements = useElements();
  const stripe = useStripe();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (elements == null || stripe == null) {
      return;
    }

    try {
      setIsPending(true);
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription-confirmation`,
        },
      });
      if (error != null) {
        throw new Error(error.message);
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        variant="default"
        className="w-full"
        disabled={isPending}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Subscribe
      </Button>
    </form>
  );
}
