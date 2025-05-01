"use client";

import { Button, type ButtonProps } from "../ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../trpc/react";
import { Dialog } from "../ui/dialog";
import PaymentForm from "./payments/payment-form";
import SubscriptionProductCard from "./subscription-product-card";

type Props = {
  size?: ButtonProps["size"];
  label?: string;
};

export default function SubscriptionDialog({
  size = "sm",
  label = "Upgrade to premium",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const { data: products, isLoading: isLoadingProducts } =
    api.payments.getProducts.useQuery();

  const {
    mutateAsync: createPaymentIntent,
    isPending: isCreatingPaymentIntent,
  } = api.payments.createPaymentIntent.useMutation();

  async function fetchClientSecret(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const subscriptionProduct = products?.[0];
    if (subscriptionProduct == null) {
      return;
    }
    const { clientSecret } = await createPaymentIntent({
      priceId: subscriptionProduct.price.id,
    });
    setClientSecret(clientSecret);
    setIsOpen(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size={size}
          variant="secondary"
          className="w-full"
          disabled={isLoadingProducts || isCreatingPaymentIntent}
          onClick={fetchClientSecret}
        >
          {isCreatingPaymentIntent ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            label
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscribe to Lumen Pro</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {products?.map((product, index) => {
            return (
              <SubscriptionProductCard
                key={index}
                name={product.name}
                description={product.description}
                price={product.price}
              />
            );
          })}
          {clientSecret !== "" && <PaymentForm clientSecret={clientSecret} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
