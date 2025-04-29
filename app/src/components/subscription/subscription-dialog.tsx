import { CheckoutProvider, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { loadStripe } from "@stripe/stripe-js";
import { Dialog } from "../ui/dialog";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PK as string;
const stripePromise = loadStripe(stripePublishableKey);

export default function SubscriptionDialog() {
  async function fetchClientSecret() {
    const response = await fetch("/api/stripe/create-payment-intent", {
      method: "POST",
    });
    const data = await response.json();
    return data.clientSecret;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full">
          Upgrade to Premium
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Upgrade to Premium to unlock all features
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <CheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <PaymentForm />
          </CheckoutProvider>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentForm() {
  return (
    <form>
      <PaymentElement />
    </form>
  );
}
